import type { CSSProperties, ReactElement } from 'react';

import { showsLogo } from 'helpers/company';
import type { Company } from 'types/company';

import styles from './CompanyLogo.module.scss';

interface CompanyLogoProps {
	company: Company;
	size?: 'sm' | 'md' | 'lg';
	decorative?: boolean;
	linked?: boolean;
	framed?: boolean;
	tabIndex?: number;
	className?: string;
}

const OPTICAL_EXPONENT = 0.3;
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.25;

export const opticalScale = (ratio: number): number =>
	Math.min(MAX_SCALE, Math.max(MIN_SCALE, ratio ** -OPTICAL_EXPONENT));

const CompanyLogo = ({
	company,
	size = 'md',
	decorative = false,
	linked = false,
	framed = false,
	tabIndex,
	className,
}: CompanyLogoProps): ReactElement => {
	const { name, logoUrl, ratio, url } = company;
	const href = linked ? url : undefined;
	const labelled = !decorative && !href;

	const content = showsLogo(company) ? (
		<span
			className={styles.CompanyLogo__mark}
			style={
				{
					'--logo': `url("${logoUrl}")`,
					'--logo-ratio': ratio,
					'--logo-scale': opticalScale(ratio).toFixed(3),
				} as CSSProperties
			}
			{...(labelled
				? { role: 'img', 'aria-label': name }
				: { 'aria-hidden': true })}
		/>
	) : (
		<span
			className={styles.CompanyLogo__name}
			aria-hidden={labelled ? undefined : true}
		>
			{name}
		</span>
	);

	const classes = [
		styles.CompanyLogo,
		styles[`CompanyLogo--${size}`],
		framed && styles['CompanyLogo--framed'],
		className,
	]
		.filter(Boolean)
		.join(' ');

	if (href) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${name} (opens in a new tab)`}
				className={`${classes} ${styles['CompanyLogo--link']}`}
				tabIndex={tabIndex}
			>
				{content}
			</a>
		);
	}

	return (
		<span className={classes} aria-hidden={decorative || undefined}>
			{content}
		</span>
	);
};

export default CompanyLogo;
