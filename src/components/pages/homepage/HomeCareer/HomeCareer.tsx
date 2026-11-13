'use client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useMemo, useState, type FC, type ReactElement } from 'react';

import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import { careerPeriod, type CareerPeriod } from 'helpers/career';
import { duration, ease } from 'styles/tokens';
import type { Experience } from 'types/career';

import styles from './HomeCareer.module.scss';

interface HomeCareerProps {
	className?: string;
	data?: {
		title?: string;
		subtitle?: string;
	};
	experiences?: Experience[];
}

interface CareerRow extends Experience {
	period: CareerPeriod;
}

const STACK_PREVIEW = 3;

const TYPE_LABEL: Record<Experience['type'], string> = {
	'full-time': 'Full-time',
	contract: 'Contract',
	freelance: 'Freelance',
	internship: 'Internship',
};

const formatPeriod = ({ start, end, current }: CareerPeriod): string => {
	if (current) return `${start} — Now`;
	return end ? `${start} — ${end}` : start;
};

const HomeCareer: FC<HomeCareerProps> = ({
	className = '',
	data,
	experiences = [],
}): ReactElement | null => {
	const baseId = useId();
	const reduceMotion = useReducedMotion();

	const rows = useMemo<CareerRow[]>(
		() =>
			experiences
				.map((experience) => ({
					...experience,
					period: careerPeriod(experience),
				}))
				.sort(
					(a, b) =>
						Number(b.period.current) - Number(a.period.current) ||
						Number(b.period.start) - Number(a.period.start)
				),
		[experiences]
	);

	const [openId, setOpenId] = useState<string | null>(rows[0]?.id ?? null);

	if (rows.length === 0) return null;

	const first = rows[rows.length - 1].period.start;
	const span = rows[0].period.current ? `${first} — Now` : first;

	return (
		<section id="career" className={`${styles.HomeCareer} ${className}`}>
			<div className={styles.HomeCareer__inner}>
				<header className={styles.HomeCareer__head}>
					<p className={styles.HomeCareer__label}>Career</p>
					<ScrambleText
						as="h2"
						className={styles.HomeCareer__title}
						text={data?.title || 'Career journey.'}
					/>
					<div className={styles.HomeCareer__aside}>
						{data?.subtitle && (
							<p className={styles.HomeCareer__lede}>{data.subtitle}</p>
						)}
						<p className={styles.HomeCareer__label}>
							{String(rows.length).padStart(2, '0')} roles · {span}
						</p>
					</div>
				</header>

				<div className={styles.HomeCareer__columns} aria-hidden="true">
					<span>Years</span>
					<span>Company</span>
					<span>Role</span>
					<span>Location</span>
					<span>Stack</span>
				</div>

				<ol className={styles.HomeCareer__table}>
					{rows.map((row) => {
						const isOpen = openId === row.id;
						const panelId = `${baseId}-${row.id}`;
						const extraStack = row.technologies.length - STACK_PREVIEW;

						return (
							<li
								key={row.id}
								className={`${styles.HomeCareer__row} ${
									isOpen ? styles['HomeCareer__row--open'] : ''
								}`}
							>
								<h3 className={styles.HomeCareer__rowHeading}>
									<button
										type="button"
										className={styles.HomeCareer__trigger}
										aria-expanded={isOpen}
										aria-controls={panelId}
										onClick={() => setOpenId(isOpen ? null : row.id)}
									>
										<span className={styles.HomeCareer__years}>
											{row.period.current && (
												<span
													className={styles.HomeCareer__live}
													aria-hidden="true"
												/>
											)}
											{formatPeriod(row.period)}
										</span>
										<span className={styles.HomeCareer__company}>
											{row.company}
										</span>
										<span className={styles.HomeCareer__role}>
											{row.position}
										</span>
										<span className={styles.HomeCareer__location}>
											{row.location}
										</span>
										<span className={styles.HomeCareer__stack}>
											{row.technologies.slice(0, STACK_PREVIEW).join(', ')}
											{extraStack > 0 && ` +${extraStack}`}
										</span>
										<span
											className={styles.HomeCareer__toggle}
											aria-hidden="true"
										/>
									</button>
								</h3>

								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											id={panelId}
											role="region"
											aria-label={`${row.position} at ${row.company}`}
											className={styles.HomeCareer__panel}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{
												duration: reduceMotion ? 0 : duration.fast,
												ease,
											}}
										>
											<div className={styles.HomeCareer__details}>
												<dl className={styles.HomeCareer__facts}>
													<div>
														<dt>Duration</dt>
														<dd>{row.duration.trim()}</dd>
													</div>
													<div>
														<dt>Type</dt>
														<dd>{TYPE_LABEL[row.type]}</dd>
													</div>
													{row.location && (
														<div>
															<dt>Location</dt>
															<dd>{row.location}</dd>
														</div>
													)}
												</dl>
												<div
													className={styles.HomeCareer__description}
													dangerouslySetInnerHTML={{ __html: row.description }}
												/>
												{row.technologies.length > 0 && (
													<ul
														className={styles.HomeCareer__tags}
														aria-label="Stack"
													>
														{row.technologies.map((tech) => (
															<li key={tech}>{tech}</li>
														))}
													</ul>
												)}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</li>
						);
					})}
				</ol>
			</div>
		</section>
	);
};

export default HomeCareer;
