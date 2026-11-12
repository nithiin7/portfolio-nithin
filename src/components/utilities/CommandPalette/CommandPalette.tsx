'use client';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	GoogleReCaptchaProvider,
	useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

import { links } from 'constants/index';
import { useTheme } from 'contexts/ThemeContext';
import { clientEnv } from 'helpers/env';
import { useFocusTrap } from 'hooks/useKeyboardNavigation';
import { duration, ease } from 'styles/tokens';
import type { SearchIndex } from 'types/search';

import styles from './CommandPalette.module.scss';

type CommandType = 'navigate' | 'action' | 'ask';

interface Command {
	id: string;
	type: CommandType;
	title: string;
	section: string;
	kind: string;
	keywords?: string;
	href?: string;
}

const MAX_ASK_QUESTIONS_PER_SESSION = 5;
const ASK_COUNT_STORAGE_KEY = 'cp_ask_count';

type AskStatus = 'idle' | 'loading' | 'done' | 'error';

interface AskState {
	status: AskStatus;
	question: string;
	answer: string;
}

interface CommandPaletteProps {
	resumeUrl: string;
}

const EMPTY_INDEX: SearchIndex = { blogPosts: [], portfolioItems: [] };

const MAX_CONTENT_RESULTS = 5;

type ExecuteRecaptcha = (action?: string) => Promise<string>;

const RecaptchaBridge = ({
	onReady,
}: {
	onReady: (execute: ExecuteRecaptcha) => void;
}): null => {
	const { executeRecaptcha } = useGoogleReCaptcha();

	useEffect(() => {
		if (executeRecaptcha) onReady(executeRecaptcha);
	}, [executeRecaptcha, onReady]);

	return null;
};

const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: duration.fast, ease } },
	exit: { opacity: 0, transition: { duration: duration.fast, ease } },
};

// Drops in from the top edge like a sheet of paper being pulled down.
const panelVariants: Variants = {
	hidden: { clipPath: 'inset(0% 0% 100% 0%)', y: '-1rem' },
	visible: {
		clipPath: 'inset(0% 0% 0% 0%)',
		y: 0,
		transition: { duration: duration.base, ease },
	},
	exit: {
		clipPath: 'inset(0% 0% 100% 0%)',
		y: '-0.5rem',
		transition: { duration: duration.fast, ease },
	},
};

const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
};

const SearchIcon = (): ReactElement => (
	<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle
			cx="10.5"
			cy="10.5"
			r="6.5"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
		<path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

const pad = (n: number) => String(n).padStart(2, '0');

const CommandPalette = ({ resumeUrl }: CommandPaletteProps): ReactElement => {
	const router = useRouter();
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();
	const prefersReducedMotion = useReducedMotion();

	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [modKey, setModKey] = useState('⌘');
	const [isAtTop, setIsAtTop] = useState(true);
	const [isHintHovered, setIsHintHovered] = useState(false);
	const [ask, setAsk] = useState<AskState>({
		status: 'idle',
		question: '',
		answer: '',
	});
	const [askCount, setAskCount] = useState(0);
	const [searchIndex, setSearchIndex] = useState<SearchIndex>(EMPTY_INDEX);
	const hasRequestedIndex = useRef(false);
	const { blogPosts, portfolioItems } = searchIndex;

	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const panelRef = useFocusTrap(isOpen);
	const executeRecaptchaRef = useRef<ExecuteRecaptcha | null>(null);
	const recaptchaSiteKey = clientEnv.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

	useEffect(() => {
		const stored = Number(sessionStorage.getItem(ASK_COUNT_STORAGE_KEY));
		if (Number.isFinite(stored) && stored > 0) setAskCount(stored);
	}, []);

	useEffect(() => {
		if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) {
			setModKey('Ctrl');
		}
	}, []);

	useEffect(() => {
		const handleScroll = () => setIsAtTop(window.scrollY < 80);
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		setQuery('');
		setSelectedIndex(0);
		setAsk({ status: 'idle', question: '', answer: '' });
		executeRecaptchaRef.current = null;
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				setIsOpen((prev) => {
					if (prev) {
						setQuery('');
						setSelectedIndex(0);
						setAsk({ status: 'idle', question: '', answer: '' });
					}
					return !prev;
				});
			}
			if (event.key === 'Escape') {
				close();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [close]);

	useEffect(() => {
		close();
	}, [pathname, close]);

	useEffect(() => {
		if (!isOpen || hasRequestedIndex.current) return;
		hasRequestedIndex.current = true;
		fetch('/api/search')
			.then((response) => (response.ok ? response.json() : EMPTY_INDEX))
			.then((index: SearchIndex) => setSearchIndex(index))
			.catch(() => {
				hasRequestedIndex.current = false;
			});
	}, [isOpen]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	const commands = useMemo<Command[]>(
		() => [
			{
				id: 'home',
				type: 'navigate',
				title: 'Home',
				section: 'Navigate',
				kind: 'Page',
				href: '/',
			},
			...links.map<Command>((link) => ({
				id: `nav-${link.title.toLowerCase()}`,
				type: 'navigate',
				title: link.title,
				section: 'Navigate',
				kind: 'Page',
				href: link.href,
			})),
			{
				id: 'stats',
				type: 'navigate',
				title: 'Live Stats',
				section: 'Navigate',
				kind: 'Page',
				keywords: 'stats dashboard live github wakatime coding activity',
				href: '/stats',
			},
			{
				id: 'contact',
				type: 'navigate',
				title: 'Contact',
				section: 'Navigate',
				kind: 'Page',
				keywords: 'email hire book call',
				href: '/contact',
			},
			{
				id: 'resume',
				type: 'navigate',
				title: 'Resume',
				section: 'Navigate',
				kind: 'Page',
				keywords: 'resume cv experience skills',
				href: '/resume',
			},
			{
				id: 'theme',
				type: 'action',
				title: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
				section: 'Actions',
				kind: 'Action',
				keywords: 'theme dark light mode toggle appearance',
			},
			{
				id: 'download-resume',
				type: 'action',
				title: 'Download resume (PDF)',
				section: 'Actions',
				kind: 'PDF',
				keywords: 'resume cv download pdf',
			},
		],
		[theme]
	);

	const blogCommands = useMemo<Command[]>(
		() =>
			blogPosts.map((post) => ({
				id: `blog-${post.slug}`,
				type: 'navigate',
				title: post.title,
				section: 'Blog Posts',
				kind: 'Post',
				href: `/blog/${post.slug}`,
			})),
		[blogPosts]
	);

	const portfolioCommands = useMemo<Command[]>(
		() =>
			portfolioItems.map((item) => ({
				id: `portfolio-${item.id}`,
				type: 'navigate',
				title: item.title,
				section: 'Portfolio',
				kind: 'Work',
				href: `/portfolio/${item.id}`,
			})),
		[portfolioItems]
	);

	const items = useMemo<Command[]>(() => {
		const trimmed = query.trim().toLowerCase();
		if (!trimmed) return commands;

		const filterBy = (list: Command[]) =>
			list.filter((command) =>
				`${command.title} ${command.keywords ?? ''}`
					.toLowerCase()
					.includes(trimmed)
			);

		const matches = [
			...filterBy(commands),
			...filterBy(blogCommands).slice(0, MAX_CONTENT_RESULTS),
			...filterBy(portfolioCommands).slice(0, MAX_CONTENT_RESULTS),
		];

		return [
			...matches,
			{
				id: 'ask-ai',
				type: 'ask',
				title: `Ask: “${query.trim()}”`,
				section: 'Ask AI',
				kind: 'AI',
			},
		];
	}, [commands, blogCommands, portfolioCommands, query]);

	useEffect(() => {
		setSelectedIndex(0);
		setAsk((prev) =>
			prev.status === 'idle'
				? prev
				: { status: 'idle', question: '', answer: '' }
		);
	}, [query]);

	const askAI = useCallback(
		async (question: string) => {
			if (askCount >= MAX_ASK_QUESTIONS_PER_SESSION) {
				setAsk({
					status: 'error',
					question,
					answer: `You've reached the ${MAX_ASK_QUESTIONS_PER_SESSION}-question limit for this session. Try the chat bubble or the contact page instead.`,
				});
				return;
			}

			setAsk({ status: 'loading', question, answer: '' });
			setAskCount((prev) => {
				const next = prev + 1;
				sessionStorage.setItem(ASK_COUNT_STORAGE_KEY, String(next));
				return next;
			});
			try {
				// The script loads when the palette opens; wait briefly if the
				// user asks before it is ready.
				for (let i = 0; i < 20 && !executeRecaptchaRef.current; i++) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
				const recaptchaToken = await executeRecaptchaRef.current?.('ask_ai');

				const response = await fetch('/api/ask', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ question, recaptchaToken }),
				});
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error ?? 'Something went wrong');
				}
				setAsk({ status: 'done', question, answer: data.answer });
			} catch (error) {
				setAsk({
					status: 'error',
					question,
					answer:
						error instanceof Error
							? error.message
							: 'Something went wrong. Please try again.',
				});
			}
		},
		[askCount]
	);

	const navigate = useCallback(
		(href: string) => {
			if (href.startsWith('/#')) {
				const target = document.getElementById(href.replace('/#', ''));
				if (target) {
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					return;
				}
			}
			router.push(href, { scroll: false });
		},
		[router]
	);

	const runCommand = useCallback(
		(command: Command) => {
			if (command.type === 'ask') {
				askAI(query.trim());
				return;
			}

			if (command.id === 'theme') {
				toggleTheme();
				return;
			}

			close();

			if (command.id === 'download-resume') {
				const link = document.createElement('a');
				link.href = resumeUrl;
				link.download = 'Nithin_Resume.pdf';
				link.target = '_blank';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				return;
			}

			if (command.href) {
				navigate(command.href);
			}
		},
		[askAI, close, navigate, query, resumeUrl, toggleTheme]
	);

	const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setSelectedIndex((prev) => (prev + 1) % items.length);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
		} else if (event.key === 'Enter' && items[selectedIndex]) {
			event.preventDefault();
			runCommand(items[selectedIndex]);
		}
	};

	useEffect(() => {
		const activeItem = listRef.current?.querySelector('[aria-selected="true"]');
		activeItem?.scrollIntoView({ block: 'nearest' });
	}, [selectedIndex, items.length]);

	const sectionCounts = items.reduce<Record<string, number>>((acc, command) => {
		acc[command.section] = (acc[command.section] ?? 0) + 1;
		return acc;
	}, {});
	let lastSection = '';
	let indexInSection = 0;
	const isHintExpanded = isAtTop || isHintHovered;

	return (
		<>
			{isOpen && (
				<GoogleReCaptchaProvider
					reCaptchaKey={recaptchaSiteKey}
					scriptProps={{
						async: true,
						defer: true,
						appendTo: 'body',
						nonce: undefined,
					}}
				>
					<RecaptchaBridge
						onReady={(execute) => {
							executeRecaptchaRef.current = execute;
						}}
					/>
				</GoogleReCaptchaProvider>
			)}
			<AnimatePresence>
				{/* The home hero's name runs to the fold, so the hint waits for the first scroll there */}
				{!isOpen &&
					!pathname?.startsWith('/blog/') &&
					!(pathname === '/' && isAtTop) && (
						<motion.button
							type="button"
							className={[
								styles.CommandPalette__hint,
								isHintExpanded ? styles['CommandPalette__hint--expanded'] : '',
							].join(' ')}
							onClick={() => {
								setIsHintHovered(false);
								setIsOpen(true);
							}}
							onMouseEnter={() => setIsHintHovered(true)}
							onMouseLeave={() => setIsHintHovered(false)}
							initial={{ opacity: 0, y: '1rem' }}
							animate={{
								opacity: 1,
								y: 0,
								transition: { duration: duration.fast, ease },
							}}
							exit={{
								opacity: 0,
								y: '1rem',
								transition: { duration: duration.fast, ease },
							}}
							aria-label={`Search and ask AI, ${modKey} K`}
							aria-keyshortcuts="Meta+K Control+K"
						>
							<span className={styles['CommandPalette__hint-icon']}>
								<SearchIcon />
							</span>
							<span className={styles['CommandPalette__hint-content']}>
								<span>Search &amp; ask AI</span>
								<span className={styles['CommandPalette__hint-keys']}>
									<kbd>{modKey}</kbd>
									<kbd>K</kbd>
								</span>
							</span>
						</motion.button>
					)}
			</AnimatePresence>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className={styles.CommandPalette}
						variants={overlayVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						onClick={close}
						data-lenis-prevent
					>
						<motion.div
							ref={panelRef}
							className={styles.CommandPalette__panel}
							role="dialog"
							aria-modal="true"
							aria-label="Command palette"
							variants={prefersReducedMotion ? fadeVariants : panelVariants}
							onClick={(event) => event.stopPropagation()}
						>
							<div className={styles.CommandPalette__bar}>
								<span>Index</span>
								<span>
									{modKey} K <span aria-hidden="true">/</span>{' '}
									<button
										type="button"
										className={styles.CommandPalette__esc}
										onClick={close}
										aria-label="Close command palette"
									>
										Esc
									</button>
								</span>
							</div>
							<div className={styles.CommandPalette__search}>
								<SearchIcon />
								<input
									ref={inputRef}
									autoFocus
									type="text"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									onKeyDown={handleInputKeyDown}
									placeholder="Search or ask anything…"
									aria-label="Search commands or ask a question"
									role="combobox"
									aria-expanded="true"
									aria-controls="command-palette-list"
									aria-activedescendant={items[selectedIndex]?.id}
									spellCheck={false}
									autoComplete="off"
								/>
							</div>
							<ul
								id="command-palette-list"
								className={styles.CommandPalette__list}
								role="listbox"
								ref={listRef}
							>
								{items.map((command, index) => {
									const showSection = command.section !== lastSection;
									if (showSection) indexInSection = 0;
									indexInSection += 1;
									lastSection = command.section;
									const isActive = index === selectedIndex;

									return (
										<li key={command.id} role="presentation">
											{showSection && (
												<div
													className={styles.CommandPalette__section}
													aria-hidden="true"
												>
													<span>{command.section}</span>
													<span>({pad(sectionCounts[command.section])})</span>
												</div>
											)}
											<button
												type="button"
												id={command.id}
												role="option"
												aria-selected={isActive}
												className={[
													styles.CommandPalette__item,
													isActive
														? styles['CommandPalette__item--active']
														: '',
													command.type === 'ask'
														? styles['CommandPalette__item--ask']
														: '',
												].join(' ')}
												onClick={() => runCommand(command)}
												onMouseEnter={() => setSelectedIndex(index)}
											>
												<span
													className={styles['CommandPalette__item-index']}
													aria-hidden="true"
												>
													{pad(indexInSection)}
												</span>
												<span className={styles['CommandPalette__item-title']}>
													{command.title}
												</span>
												<span
													className={styles['CommandPalette__item-kind']}
													aria-hidden="true"
												>
													{command.kind}
												</span>
												<span
													className={styles['CommandPalette__item-arrow']}
													aria-hidden="true"
												>
													→
												</span>
											</button>
										</li>
									);
								})}
							</ul>
							<AnimatePresence>
								{ask.status !== 'idle' && (
									<motion.div
										className={styles.CommandPalette__answer}
										initial={{ opacity: 0, height: 0 }}
										animate={{
											opacity: 1,
											height: 'auto',
											transition: { duration: duration.fast, ease },
										}}
										exit={{
											opacity: 0,
											height: 0,
											transition: { duration: duration.fast, ease },
										}}
										aria-live="polite"
									>
										<p className={styles['CommandPalette__answer-label']}>
											<span>Answer</span>
											<span>
												{pad(askCount)} / {pad(MAX_ASK_QUESTIONS_PER_SESSION)}
											</span>
										</p>
										<p className={styles['CommandPalette__answer-question']}>
											{ask.question}
										</p>
										{ask.status === 'loading' && (
											<p
												className={styles['CommandPalette__answer-loading']}
												role="status"
											>
												Thinking<span aria-hidden="true">_</span>
											</p>
										)}
										{ask.status === 'done' && (
											<p className={styles['CommandPalette__answer-text']}>
												{ask.answer}
											</p>
										)}
										{ask.status === 'error' && (
											<p className={styles['CommandPalette__answer-error']}>
												{ask.answer}
											</p>
										)}
									</motion.div>
								)}
							</AnimatePresence>
							<div className={styles.CommandPalette__footer}>
								<span>
									<kbd>↑</kbd>
									<kbd>↓</kbd> Move
								</span>
								<span>
									<kbd>↵</kbd> Open
								</span>
								<span className={styles['CommandPalette__footer-ai']}>
									Type a question to ask AI
								</span>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default CommandPalette;
