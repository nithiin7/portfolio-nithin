'use client';
import type { Variants } from 'motion/react';
import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties, FC } from 'react';
import { useCallback } from 'react';

import { EXTERNAL_ARROW } from 'constants/index';
import { calendarDay } from 'helpers/format';
import { duration, ease } from 'styles/tokens';
import type { Certification } from 'types/certification';

import styles from './CertificationModal.module.scss';

interface CertificationModalProps {
	certification: Certification;
}

const stagger: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.06, delayChildren: duration.fast * 0.5 },
	},
};

const rise: Variants = {
	hidden: { opacity: 0, y: '1rem' },
	visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
};

const fade: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

const formatDate = (dateString: string) =>
	calendarDay(dateString).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	});

const CertificationModal: FC<CertificationModalProps> = ({ certification }) => {
	const prefersReducedMotion = useReducedMotion();
	const item = prefersReducedMotion ? fade : rise;

	const isExpired = certification.expiryDate
		? new Date(certification.expiryDate) < new Date()
		: false;

	const copyCredentialId = useCallback(async () => {
		if (!certification.credentialId) return;
		const { toast } = await import('sonner');
		try {
			await navigator.clipboard.writeText(certification.credentialId);
			toast('Credential ID copied', {
				description: certification.credentialId,
			});
		} catch {
			toast.error('Couldn’t copy the credential ID');
		}
	}, [certification.credentialId]);

	const rows = [
		{ label: 'Issued', value: formatDate(certification.issuedDate) },
		certification.expiryDate && {
			label: isExpired ? 'Expired' : 'Expires',
			value: formatDate(certification.expiryDate),
		},
	].filter(Boolean) as { label: string; value: string }[];

	return (
		<motion.article
			className={styles.CertificationModal}
			variants={stagger}
			initial="hidden"
			animate="visible"
		>
			<motion.header
				className={styles.CertificationModal__header}
				variants={item}
			>
				<div className={styles.CertificationModal__logo}>
					<span
						className={styles.CertificationModal__mark}
						style={
							{ '--logo': `url("${certification.logo}")` } as CSSProperties
						}
						aria-hidden="true"
					/>
				</div>
				<div className={styles.CertificationModal__heading}>
					<p className={styles.CertificationModal__meta}>
						<span className={styles.CertificationModal__provider}>
							{certification.provider}
						</span>
						{certification.expiryDate && (
							<span
								className={`${styles.CertificationModal__status} ${
									isExpired ? styles['CertificationModal__status--expired'] : ''
								}`}
							>
								{isExpired ? 'Expired' : 'Active'}
							</span>
						)}
					</p>
					<h2 className={styles.CertificationModal__name}>
						{certification.name}
					</h2>
				</div>
			</motion.header>

			<motion.dl className={styles.CertificationModal__specs} variants={item}>
				{rows.map((row) => (
					<div key={row.label} className={styles.CertificationModal__row}>
						<dt>{row.label}</dt>
						<dd>{row.value}</dd>
					</div>
				))}
				{certification.credentialId && (
					<div className={styles.CertificationModal__row}>
						<dt>Credential ID</dt>
						<dd>
							<button
								type="button"
								className={styles.CertificationModal__copy}
								onClick={copyCredentialId}
							>
								<code>{certification.credentialId}</code>
								<span>
									Copy
									<span className={styles.srOnly}> credential ID</span>
								</span>
							</button>
						</dd>
					</div>
				)}
			</motion.dl>

			{certification.description && (
				<motion.section
					className={styles.CertificationModal__block}
					variants={item}
				>
					<h3 className={styles.CertificationModal__label}>About</h3>
					<p className={styles.CertificationModal__text}>
						{certification.description}
					</p>
				</motion.section>
			)}

			{certification.skills && certification.skills.length > 0 && (
				<motion.section
					className={styles.CertificationModal__block}
					variants={item}
				>
					<h3 className={styles.CertificationModal__label}>
						Skills{' '}
						<span>
							({String(certification.skills.length).padStart(2, '0')})
						</span>
					</h3>
					<ul className={styles.CertificationModal__skills}>
						{certification.skills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</motion.section>
			)}

			{certification.certificateUrl && (
				<motion.a
					className={styles.CertificationModal__cta}
					href={certification.certificateUrl}
					target="_blank"
					rel="noopener noreferrer"
					variants={item}
				>
					<span>View certificate</span>
					<span
						className={styles['CertificationModal__cta-arrow']}
						aria-hidden="true"
					>
						{EXTERNAL_ARROW}
					</span>
					<span className={styles.srOnly}>(opens in a new tab)</span>
				</motion.a>
			)}
		</motion.article>
	);
};

export default CertificationModal;
