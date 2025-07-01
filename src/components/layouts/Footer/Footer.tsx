'use client';

import { useLenis } from '@studio-freight/react-lenis';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';

import MagneticButton from 'components/utilities/MagneticButton';
import { footerLinks, socials, songs } from 'constants/index';
import { useTheme } from 'contexts/ThemeContext';
import type { Social } from 'types/social';
import type { Song } from 'types/song';
import type { FooterLink } from 'types/utils';

import styles from './Footer.module.scss';

/**
 * Footer component displaying various links, social icons, and a randomly selected song.
 * Includes a contact link if on the homepage.
 *
 * @component
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = (): ReactElement => {
	const [randomSong, setRandomSong] = useState<Song | null>(null);
	const lenis = useLenis();
	const pathname = usePathname();
	const { theme } = useTheme();

	/**
	 * Selects a random song from the songs array.
	 *
	 * @returns {Song} A random song object.
	 */
	const getRandomSong = (): Song => {
		const randomIndex = Math.floor(Math.random() * songs.length);
		return songs[randomIndex];
	};

	/**
	 * Scrolls to a specified section using Lenis smooth scrolling.
	 *
	 * @param {string} to - The ID of the section to scroll to.
	 */
	const handleScroll = (to: string) => {
		if (lenis) {
			lenis.scrollTo(`#${to}`, {
				duration: 2,
			});
		}
	};

	useEffect(() => {
		const randomSong = getRandomSong();
		setRandomSong(randomSong);
	}, []);

	return (
		<footer className={styles['footer']}>
			{pathname === '/' && (
				<div className={styles['footer__contact']}>
					<span>Got a project? Need an unfair advantage?</span>
					<Link href={'/contact'} title="Contact">
						<svg
							viewBox="0 0 896 104"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M811.387 2.05176H833.749V40.2786H873.789V2.05176H896V102.68H873.789V61.1296H833.749V102.68H811.387V2.05176Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M711.925 52.0641C711.925 41.689 713.839 32.6737 717.666 25.0183C721.494 17.2621 726.833 11.2687 733.682 7.03806C740.633 2.7067 748.691 0.541016 757.857 0.541016C766.218 0.541016 773.672 2.00159 780.219 4.92274C786.767 7.8439 792.005 12.1753 795.933 17.9168C799.862 23.5577 802.128 30.508 802.732 38.7678H780.219C779.917 33.2277 777.751 28.846 773.722 25.6226C769.794 22.2986 764.606 20.6365 758.16 20.6365C750.706 20.6365 744.914 23.4066 740.784 28.9467C736.654 34.3861 734.589 42.0919 734.589 52.0641C734.589 62.137 736.654 69.9436 740.784 75.4837C744.914 81.0238 750.706 83.7939 758.16 83.7939C764.606 83.7939 769.794 82.1318 773.722 78.8077C777.651 75.4837 779.816 71.0516 780.219 65.5115H802.732C802.329 73.872 800.113 80.9231 796.084 86.6646C792.156 92.4062 786.867 96.7376 780.219 99.6587C773.571 102.479 766.117 103.889 757.857 103.889C748.691 103.889 740.633 101.724 733.682 97.3923C726.833 93.061 721.494 87.0172 717.666 79.261C713.839 71.5049 711.925 62.4392 711.925 52.0641Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M621.679 2.05176H643.89V63.396C643.89 69.5405 645.603 74.3251 649.027 77.7499C652.553 81.074 657.438 82.736 663.684 82.736C669.425 82.736 673.908 81.074 677.131 77.7499C680.354 74.3251 681.966 69.5405 681.966 63.396V2.05176H704.026V63.396C704.026 71.555 702.313 78.6565 698.889 84.7002C695.564 90.744 690.881 95.4783 684.837 98.9031C678.793 102.227 671.742 103.889 663.684 103.889C655.323 103.889 647.97 102.227 641.624 98.9031C635.379 95.4783 630.493 90.744 626.968 84.7002C623.442 78.6565 621.679 71.555 621.679 63.396V2.05176Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M519.304 2.05176V23.0538H491.503V102.68H469.443V23.0538H441.491V2.05176H519.304Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M385.955 2.05176H408.166V102.68H384.897L343.799 34.9903V102.68H321.438V2.05176H348.937L385.955 65.8135V2.05176Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M289.363 2.05176H311.574V102.68H289.363V2.05176Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M256.189 2.05176V23.0538H228.388V102.68H206.328V23.0538H178.376V2.05176H256.189Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M172.743 2.05176V23.0538H123.335V41.1851H168.361V62.0361H123.335V81.8294H172.743V102.68H100.973V2.05176H172.743Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M0 52.0642C0 41.6891 1.91386 32.6738 5.74158 25.0184C9.67002 17.2622 15.1094 11.2688 22.0597 7.03821C29.0101 2.70684 37.1188 0.541164 46.3859 0.541164C54.6457 0.541164 61.9989 2.00174 68.4456 4.92289C74.993 7.84404 80.1806 12.0243 84.0083 17.4637C87.9367 22.8024 90.2032 29.249 90.8075 36.8037H68.2945C67.6901 31.7673 65.5245 27.7885 61.7975 24.8673C58.1712 21.9462 53.2858 20.4856 47.1414 20.4856C39.3852 20.4856 33.3414 23.2556 29.0101 28.7958C24.7794 34.3359 22.6641 42.092 22.6641 52.0642C22.6641 62.1372 24.6787 69.9437 28.7079 75.4838C32.8378 81.0239 38.5794 83.794 45.9326 83.794C52.0771 83.794 57.0632 82.0312 60.8909 78.5057C64.7186 74.9802 66.8843 70.1955 67.388 64.1518H43.6662V46.1716H90.8075V102.681H74.0361L73.1295 88.4779C69.9062 93.3129 65.7259 97.0903 60.5887 99.81C55.5523 102.53 49.9618 103.89 43.8173 103.89C35.0538 103.89 27.3984 101.724 20.851 97.3925C14.3036 93.0611 9.16637 87.0173 5.43939 79.2612C1.81313 71.505 0 62.4394 0 52.0642Z"
								fill={theme === 'dark' ? '#2E2E2E' : 'rgb(209 209 199)'}
							/>
							<path
								d="M524.794 25.7737C520.865 33.6306 518.901 42.8977 518.901 53.575C518.901 63.648 520.865 72.4618 524.794 80.0165C528.823 87.5712 534.413 93.4639 541.565 97.6945C548.717 101.824 557.027 103.889 566.496 103.889C576.065 103.889 584.375 101.824 591.426 97.6945C598.578 93.4639 604.118 87.5712 608.046 80.0165C612.076 72.4618 614.09 63.648 614.09 53.575C614.09 42.8977 612.076 33.6306 608.046 25.7737C604.118 17.8161 598.578 11.6212 591.426 7.18916C584.375 2.75706 576.065 0.541016 566.496 0.541016C557.027 0.541016 548.717 2.75706 541.565 7.18916C534.413 11.6212 528.823 17.8161 524.794 25.7737Z"
								fill={theme === 'dark' ? '#AFAF9D' : 'rgb(107 100 92)'}
							/>
						</svg>
					</Link>
				</div>
			)}
			<svg
				width="1186"
				height="1186"
				viewBox="0 0 1186 1186"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={styles['footer__bg']}
				aria-hidden="true"
			>
				<circle
					cx="593"
					cy="593"
					r="593"
					fill="url(#paint0_linear_4949_267)"
				></circle>
				<defs>
					<linearGradient
						id="paint0_linear_4949_267"
						x1="593"
						y1="0"
						x2="593"
						y2="1186"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor={theme === 'dark' ? '#2E2E2E' : '#393632'}></stop>
						<stop
							offset="1"
							stopColor={theme === 'dark' ? '#2E2E2E' : '#393632'}
							stopOpacity="0"
						></stop>
					</linearGradient>
				</defs>
			</svg>
			<div className={styles['footer__column']}>
				<div className={styles['footer__music']}>
					<div className={styles['music__spotify']}>
						<svg
							width="41"
							height="40"
							viewBox="0 0 41 40"
							fill={theme === 'dark' ? 'white' : 'black'}
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path d="M20.5013 0.0664062C9.48964 0.0664062 0.5625 8.99331 0.5625 20.005C0.5625 31.0171 9.48964 39.9433 20.5013 39.9433C31.5142 39.9433 40.4404 31.0171 40.4404 20.005C40.4404 8.99403 31.5142 0.0673586 20.5011 0.0673586L20.5013 0.0664062V0.0664062ZM29.6451 28.8236C29.56 28.963 29.4483 29.0842 29.3163 29.1804C29.1843 29.2766 29.0346 29.3458 28.8758 29.3841C28.717 29.4223 28.5522 29.4289 28.3909 29.4034C28.2296 29.3779 28.0748 29.3208 27.9356 29.2355C23.2542 26.3759 17.3608 25.7283 10.4204 27.314C10.099 27.3871 9.76174 27.3296 9.48275 27.1541C9.20375 26.9787 9.00584 26.6996 8.9325 26.3783C8.89597 26.2192 8.89119 26.0545 8.91842 25.8935C8.94565 25.7326 9.00436 25.5786 9.09118 25.4404C9.17801 25.3021 9.29126 25.1824 9.42443 25.088C9.5576 24.9936 9.70808 24.9264 9.86726 24.8902C17.4625 23.1543 23.9775 23.9021 29.2332 27.114C29.8189 27.4736 30.0046 28.2378 29.6451 28.8236V28.8236ZM32.0856 23.3938C31.6356 24.1259 30.6785 24.3569 29.9475 23.9069C24.588 20.6119 16.4182 19.6578 10.0789 21.5821C9.25679 21.8305 8.38845 21.3671 8.13893 20.5464C8.01986 20.1518 8.06213 19.7262 8.25647 19.3627C8.4508 18.9993 8.78134 18.7277 9.1756 18.6076C16.4168 16.4105 25.4189 17.4747 31.5737 21.2569C32.3046 21.7069 32.5356 22.664 32.0856 23.394V23.3938ZM32.2951 17.7405C25.8689 13.9236 15.2665 13.5726 9.13107 15.4347C8.14583 15.7335 7.10393 15.1774 6.80536 14.1921C6.66179 13.7188 6.71209 13.2078 6.94521 12.7715C7.17832 12.3353 7.57515 12.0094 8.04845 11.8657C15.0915 9.7276 26.7999 10.1407 34.1985 14.5328C34.4093 14.6576 34.5935 14.8227 34.7404 15.0187C34.8874 15.2147 34.9942 15.4378 35.0548 15.6752C35.1154 15.9126 35.1286 16.1596 35.0936 16.4021C35.0586 16.6446 34.9761 16.8778 34.8508 17.0883C34.327 17.9745 33.1794 18.2666 32.2961 17.7405H32.2951Z"></path>
						</svg>
					</div>
					<div className={styles['music__title']}>
						<h2>On repeat</h2>
						{randomSong && (
							<span>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={randomSong.link}
									title={randomSong.name}
								>
									{randomSong.name}
								</a>
							</span>
						)}
					</div>
				</div>
			</div>
			{pathname === '/' && (
				<ul className={styles['footer__permalinks']}>
					{footerLinks.map((link: FooterLink) => (
						<li key={link.key}>
							<ScrollLink
								to={link.href}
								href={`#${link.href}`}
								onClick={() => {
									handleScroll(link.href);
								}}
							>
								{link.key}
							</ScrollLink>
						</li>
					))}
				</ul>
			)}
			<div className={styles['footer__socials']}>
				{socials.map((social: Social, index: number) => (
					<MagneticButton
						key={index}
						href={social.link}
						title={social.title}
						className={styles['social-link']}
					>
						{social.icon}
					</MagneticButton>
				))}
			</div>
			<div className={styles['footer__copyright']}>
				<small>&copy; Nithin Pradeep. All rights reserved</small>
			</div>
		</footer>
	);
};

export default Footer;
