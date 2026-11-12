import type { CSSProperties, ReactElement } from 'react';

import LocalClock from 'components/utilities/LocalClock/LocalClock';
import { siteConfig } from 'config/site';

import styles from './HomeHeader.module.scss';
import HomeHeaderActions from './HomeHeaderActions';
import HomeHeaderCompress from './HomeHeaderCompress';

interface HomeHeaderProps {
	className?: string;
}

const NAME_LINES = ['Nithin', 'Pradeep.'];

const stagger = (i: number): CSSProperties => ({ '--i': i }) as CSSProperties;

/**
 * Server-rendered hero. All entrance motion is CSS keyed off first paint, so
 * the <h1> (the LCP element) never waits on hydration. Client islands: the
 * live clock, the scroll compress on the name, and the CTA row.
 */
const HomeHeader = ({ className = '' }: HomeHeaderProps): ReactElement => {
	const { role, company, location, availability } = siteConfig;

	return (
		<header
			id="home"
			className={[styles.HomeHeader, className].join(' ')}
			aria-labelledby="home-title"
		>
			<dl className={styles.HomeHeader__meta}>
				<div className={styles.HomeHeader__cell} style={stagger(0)}>
					<dt className={styles.HomeHeader__label}>Role</dt>
					<dd className={styles.HomeHeader__value}>
						{role}
						<br />@ {company}
					</dd>
				</div>
				<div className={styles.HomeHeader__cell} style={stagger(1)}>
					<dt className={styles.HomeHeader__label}>Based in</dt>
					<dd className={styles.HomeHeader__value}>
						{location.city}, {location.country}
						<br />
						<LocalClock timeZone={location.timeZone} zoneLabel="IST" />
					</dd>
				</div>
				<div
					className={[styles.HomeHeader__cell, styles.HomeHeader__status].join(
						' '
					)}
					style={stagger(2)}
				>
					<dt className={styles.HomeHeader__label}>Status</dt>
					<dd className={styles.HomeHeader__value}>
						<span
							className={styles.HomeHeader__dot}
							data-open={availability.open}
							aria-hidden="true"
						/>
						{availability.label}
					</dd>
				</div>
			</dl>

			<div className={styles.HomeHeader__pitch}>
				<p className={styles.HomeHeader__lede}>
					I build AI agents, <em>guardrails</em> &amp; MCP infrastructure — and
					the full-stack products around them.
				</p>
				<HomeHeaderActions className={styles.HomeHeader__actions} />
			</div>

			<HomeHeaderCompress className={styles.HomeHeader__nameWrap}>
				<h1 id="home-title" className={styles.HomeHeader__name}>
					{NAME_LINES.map((line, i) => (
						<span key={line} className={styles.HomeHeader__line}>
							<span style={stagger(i)}>{line}</span>
						</span>
					))}
				</h1>
			</HomeHeaderCompress>
		</header>
	);
};

export default HomeHeader;
