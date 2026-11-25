'use client';
import {
	AnimatePresence,
	motion,
	useReducedMotion,
	type Variants,
} from 'motion/react';
import {
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactElement,
} from 'react';

import { useConsent } from 'contexts/ConsentContext';
import { fadeVariants } from 'helpers/animations';
import { duration, ease } from 'styles/tokens';

import styles from './ConsentBanner.module.scss';

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: duration.fast, ease } },
	exit: { opacity: 0, y: 12, transition: { duration: duration.fast, ease } },
};

const panelVariants: Variants = {
	hidden: { opacity: 0, height: 0 },
	visible: {
		opacity: 1,
		height: 'auto',
		transition: { duration: duration.fast, ease },
	},
};

/** Analytics consent card: accept, decline or fine-tune what loads. */
const ConsentBanner = (): ReactElement => {
	const { analytics, decided, view, save, showPrompt, openSettings, close } =
		useConsent();
	const reduced = useReducedMotion();
	const [draft, setDraft] = useState(analytics);
	const switchRef = useRef<HTMLButtonElement>(null);
	const customiseRef = useRef<HTMLButtonElement>(null);
	const movedFocus = useRef(false);

	const settings = view === 'settings';

	useEffect(() => {
		if (!settings) return;
		setDraft(analytics);
		switchRef.current?.focus({ preventScroll: true });
	}, [settings, analytics]);

	useEffect(() => {
		if (view !== 'prompt' || !movedFocus.current) return;
		movedFocus.current = false;
		customiseRef.current?.focus({ preventScroll: true });
	}, [view]);

	const back = (): void => {
		if (decided) {
			close();
			return;
		}
		movedFocus.current = true;
		showPrompt();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
		if (event.key !== 'Escape' || !settings) return;
		event.stopPropagation();
		back();
	};

	return (
		<AnimatePresence>
			{view !== 'hidden' && (
				<motion.section
					key="consent"
					className={styles.ConsentBanner}
					aria-labelledby="consent-title"
					aria-describedby="consent-description"
					data-lenis-prevent
					variants={reduced ? fadeVariants : cardVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					onKeyDown={handleKeyDown}
				>
					<div className={styles.ConsentBanner__head}>
						<p className={styles.ConsentBanner__label}>
							<span className={styles.ConsentBanner__dot} aria-hidden="true" />
							Privacy
						</p>
						{settings ? (
							<button
								type="button"
								className={styles.ConsentBanner__text}
								onClick={back}
							>
								{decided ? 'Close' : 'Back'}
							</button>
						) : (
							<button
								ref={customiseRef}
								type="button"
								className={styles.ConsentBanner__text}
								onClick={() => openSettings()}
							>
								Customise
							</button>
						)}
					</div>

					<p id="consent-title" className={styles.ConsentBanner__title}>
						Mind if I <em>count</em> your visit?
					</p>
					<p id="consent-description" className={styles.ConsentBanner__body}>
						Anonymous analytics show me which work gets read. Nothing is tracked
						until you say yes.
					</p>

					<AnimatePresence initial={false}>
						{settings && (
							<motion.div
								key="options"
								className={styles.ConsentBanner__panel}
								variants={reduced ? fadeVariants : panelVariants}
								initial="hidden"
								animate="visible"
							>
								<ul className={styles.ConsentBanner__options}>
									<li className={styles.ConsentBanner__option}>
										<div>
											<p className={styles.ConsentBanner__name}>Essential</p>
											<p className={styles.ConsentBanner__detail}>
												Theme, spam protection and error reports.
											</p>
										</div>
										<span className={styles.ConsentBanner__always}>
											Always on
										</span>
									</li>
									<li className={styles.ConsentBanner__option}>
										<div>
											<p
												id="consent-analytics"
												className={styles.ConsentBanner__name}
											>
												Analytics
											</p>
											<p
												id="consent-analytics-detail"
												className={styles.ConsentBanner__detail}
											>
												Google Analytics and Vercel page views.
											</p>
										</div>
										<button
											ref={switchRef}
											type="button"
											role="switch"
											aria-checked={draft}
											aria-labelledby="consent-analytics"
											aria-describedby="consent-analytics-detail"
											className={styles.ConsentBanner__switch}
											onClick={() => setDraft((value) => !value)}
										/>
									</li>
								</ul>
							</motion.div>
						)}
					</AnimatePresence>

					<div className={styles.ConsentBanner__actions}>
						{settings ? (
							<button
								type="button"
								className={`${styles.ConsentBanner__button} ${styles['ConsentBanner__button--primary']}`}
								onClick={() => save({ analytics: draft })}
							>
								Save choices
							</button>
						) : (
							<>
								<button
									type="button"
									className={`${styles.ConsentBanner__button} ${styles['ConsentBanner__button--primary']}`}
									onClick={() => save({ analytics: true })}
								>
									Accept
								</button>
								<button
									type="button"
									className={styles.ConsentBanner__button}
									onClick={() => save({ analytics: false })}
								>
									Decline
								</button>
							</>
						)}
					</div>
				</motion.section>
			)}
		</AnimatePresence>
	);
};

export default ConsentBanner;
