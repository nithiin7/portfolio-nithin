import type { ReactElement } from 'react';

import type { SiteSettings } from 'types/site';

import styles from './Preloader.module.scss';

const STORAGE_KEY = 'np:visited';
const PRELOAD_ATTR_TTL = 2500;

export const preloaderScript = `(function(){try{var d=document.documentElement,s=sessionStorage;if(s.getItem('${STORAGE_KEY}'))return;s.setItem('${STORAGE_KEY}','1');if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-preload','true');setTimeout(function(){d.removeAttribute('data-preload')},${PRELOAD_ATTR_TTL})}catch(e){}})();`;

interface PreloaderProps {
	site: Pick<SiteSettings, 'name' | 'location'>;
}

const Preloader = ({ site }: PreloaderProps): ReactElement => {
	const [first, ...rest] = site.name.split(' ');

	return (
		<div className={styles.Preloader} aria-hidden="true">
			<div className={styles.Preloader__grid}>
				<span className={styles.Preloader__h} />
				<span className={styles.Preloader__v} />
				<span className={styles.Preloader__v} />
				<span className={styles.Preloader__v} />
			</div>
			<p className={styles.Preloader__name}>
				<span className={styles.Preloader__mask}>
					<span>{first}</span>
				</span>
				<span className={styles.Preloader__mask}>
					<span>{rest.join(' ')}</span>
				</span>
			</p>
			<p className={styles.Preloader__meta}>
				{site.location.city} · Portfolio ©{new Date().getFullYear()}
			</p>
			<p className={styles.Preloader__count} />
		</div>
	);
};

export default Preloader;
