'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	GoogleReCaptchaProvider,
	useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { BsStars } from 'react-icons/bs';
import {
	FiActivity,
	FiAward,
	FiBookOpen,
	FiBriefcase,
	FiCode,
	FiDownload,
	FiFileText,
	FiFolder,
	FiHome,
	FiLayers,
	FiMail,
	FiMoon,
	FiSearch,
	FiSun,
	FiUser,
} from 'react-icons/fi';

import { links } from 'constants/index';
import { useTheme } from 'contexts/ThemeContext';
import { clientEnv } from 'helpers/env';
import { useFocusTrap } from 'hooks/useKeyboardNavigation';

import styles from './CommandPalette.module.scss';

type CommandType = 'navigate' | 'action' | 'ask';

interface Command {
	id: string;
	type: CommandType;
	title: string;
	section: string;
	icon: ReactElement;
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

interface BlogSearchItem {
	title: string;
	slug: string;
}

interface PortfolioSearchItem {
	id: number;
	title: string;
}

interface CommandPaletteProps {
	resumeUrl: string;
	blogPosts?: BlogSearchItem[];
	portfolioItems?: PortfolioSearchItem[];
}

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

const navIcons: Record<string, ReactElement> = {
	About: <FiUser />,
	Blogs: <FiBookOpen />,
	Companies: <FiBriefcase />,
	Services: <FiLayers />,
	Works: <FiFolder />,
	Certifications: <FiAward />,
};

const CommandPalette = ({
	resumeUrl,
	blogPosts = [],
	portfolioItems = [],
}: CommandPaletteProps): ReactElement => {
	const router = useRouter();
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();

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
				icon: <FiHome />,
				href: '/',
			},
			...links.map<Command>((link) => ({
				id: `nav-${link.title.toLowerCase()}`,
				type: 'navigate',
				title: link.title,
				section: 'Navigate',
				icon: navIcons[link.title] ?? <FiFolder />,
				href: link.href,
			})),
			{
				id: 'stats',
				type: 'navigate',
				title: 'Live Stats',
				section: 'Navigate',
				icon: <FiActivity />,
				keywords: 'stats dashboard live github wakatime coding activity',
				href: '/stats',
			},
			{
				id: 'contact',
				type: 'navigate',
				title: 'Contact',
				section: 'Navigate',
				icon: <FiMail />,
				keywords: 'email hire book call',
				href: '/contact',
			},
			{
				id: 'resume',
				type: 'navigate',
				title: 'Resume',
				section: 'Navigate',
				icon: <FiFileText />,
				keywords: 'resume cv experience skills',
				href: '/resume',
			},
			{
				id: 'theme',
				type: 'action',
				title: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
				section: 'Actions',
				icon: theme === 'dark' ? <FiSun /> : <FiMoon />,
				keywords: 'theme dark light mode toggle appearance',
			},
			{
				id: 'download-resume',
				type: 'action',
				title: 'Download resume (PDF)',
				section: 'Actions',
				icon: <FiDownload />,
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
				icon: <FiFileText />,
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
				icon: <FiCode />,
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
				title: `Ask AI: “${query.trim()}”`,
				section: 'Ask AI',
				icon: <BsStars />,
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

	let lastSection = '';
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
				{!isOpen && !pathname?.startsWith('/blog/') && (
					<motion.button
						className={[
							styles.CommandPalette__hint,
							isHintExpanded ? '' : styles['CommandPalette__hint--collapsed'],
						].join(' ')}
						onClick={() => {
							setIsHintHovered(false);
							setIsOpen(true);
						}}
						onMouseEnter={() => setIsHintHovered(true)}
						onMouseLeave={() => setIsHintHovered(false)}
						initial={{ opacity: 0, y: 20, x: '-50%' }}
						animate={{ opacity: 1, y: 0, x: '-50%' }}
						exit={{ opacity: 0, y: 20, x: '-50%' }}
						transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
						aria-label="Open command palette"
					>
						<FiSearch aria-hidden="true" />
						<AnimatePresence initial={false}>
							{isHintExpanded && (
								<motion.span
									className={styles['CommandPalette__hint-content']}
									initial={{ width: 0, opacity: 0, marginLeft: 0 }}
									animate={{ width: 'auto', opacity: 1, marginLeft: 8 }}
									exit={{ width: 0, opacity: 0, marginLeft: 0 }}
									transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
								>
									<span className={styles['CommandPalette__hint-label']}>
										Navigate & ask AI
									</span>
									<span className={styles['CommandPalette__hint-keys']}>
										<kbd>{modKey}</kbd>
										<kbd>K</kbd>
									</span>
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className={styles.CommandPalette}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
						onClick={close}
						data-lenis-prevent
					>
						<motion.div
							ref={panelRef}
							className={styles.CommandPalette__panel}
							role="dialog"
							aria-modal="true"
							aria-label="Command palette"
							initial={{ opacity: 0, scale: 0.96, y: -12 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: -12 }}
							transition={{
								duration: 0.2,
								ease: [0.4, 0, 0.2, 1],
								type: 'spring',
								stiffness: 300,
								damping: 25,
							}}
							onClick={(event) => event.stopPropagation()}
						>
							<div className={styles.CommandPalette__search}>
								<FiSearch aria-hidden="true" />
								<input
									ref={inputRef}
									autoFocus
									type="text"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									onKeyDown={handleInputKeyDown}
									placeholder="Search, or ask “What's his experience with React?”"
									aria-label="Search commands or ask a question"
									role="combobox"
									aria-expanded="true"
									aria-controls="command-palette-list"
									aria-activedescendant={items[selectedIndex]?.id}
									spellCheck={false}
									autoComplete="off"
								/>
								<kbd className={styles.CommandPalette__kbd}>esc</kbd>
							</div>
							<ul
								id="command-palette-list"
								className={styles.CommandPalette__list}
								role="listbox"
								ref={listRef}
							>
								{items.map((command, index) => {
									const showSection = command.section !== lastSection;
									lastSection = command.section;

									return (
										<li key={command.id} role="presentation">
											{showSection && (
												<div
													className={styles.CommandPalette__section}
													aria-hidden="true"
												>
													{command.section}
												</div>
											)}
											<button
												id={command.id}
												role="option"
												aria-selected={index === selectedIndex}
												className={[
													styles.CommandPalette__item,
													index === selectedIndex
														? styles['CommandPalette__item--active']
														: '',
												].join(' ')}
												onClick={() => runCommand(command)}
												onMouseEnter={() => setSelectedIndex(index)}
											>
												<span className={styles['CommandPalette__item-icon']}>
													{command.icon}
												</span>
												<span className={styles['CommandPalette__item-title']}>
													{command.title}
												</span>
												{command.type === 'ask' && (
													<span
														className={styles['CommandPalette__item-badge']}
													>
														AI
													</span>
												)}
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
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
										aria-live="polite"
									>
										<div className={styles['CommandPalette__answer-question']}>
											<BsStars aria-hidden="true" />
											{ask.question}
										</div>
										{ask.status === 'loading' && (
											<div
												className={styles['CommandPalette__answer-loading']}
												aria-label="Thinking"
											>
												<span />
												<span />
												<span />
											</div>
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
									<kbd className={styles.CommandPalette__kbd}>↑</kbd>
									<kbd className={styles.CommandPalette__kbd}>↓</kbd> navigate
								</span>
								<span>
									<kbd className={styles.CommandPalette__kbd}>↵</kbd> select
								</span>
								<span className={styles['CommandPalette__footer-ai']}>
									<BsStars aria-hidden="true" /> type a question to ask AI
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
