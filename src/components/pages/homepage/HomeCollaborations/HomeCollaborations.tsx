'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useRef, type FC } from 'react';

import GameAwardsLogo from 'assets/logos/game-awards.svg';
import PaytmLogo from 'assets/logos/paytm-payments-bank.svg';
import SpotifyCodesLogo from 'assets/logos/spotify-codes.svg';
import SpotifyLogo from 'assets/logos/spotify.svg';
import WhiteRabbitLogo from 'assets/logos/white-rabbit.svg';
import MaskText from 'components/utilities/MaskText/MaskText';

import styles from './HomeCollaborations.module.scss';

interface HomeCollaborationsProps {
	className?: string;
	data?: {
		title?: string;
	};
}

const logoComponents = [
	{
		Component: WhiteRabbitLogo,
		name: 'WhiteRabbitLogo',
		url: 'https://whiterabbit.group/',
	},
	{
		Component: SpotifyLogo,
		name: 'SpotifyLogo',
		url: 'https://connect.spotify.com/',
	},
	{
		Component: GameAwardsLogo,
		name: 'GameAwardsLogo',
		url: 'https://thegameawards.com/',
	},
	{
		Component: PaytmLogo,
		name: 'PaytmLogo',
		url: 'https://www.paytmbank.com/',
	},
	{
		Component: SpotifyCodesLogo,
		name: 'SpotifyCodesLogo',
		url: 'https://www.spotifycodes.com/',
	},
];

/**
 * HomeCollaborations component displays a list of company logos with an animated title.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {Object} [data] - Data for the component.
 * @param {string} [data.title] - Title text for the collaboration section, displayed with mask effect.
 * @returns {JSX.Element} The rendered HomeCollaborations component.
 */
const HomeCollaborations: FC<HomeCollaborationsProps> = ({
	className = '',
	data = {},
}) => {
	const ref = useRef(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});

	const scale = useTransform(scrollYProgress, [0.7, 1], [1, 0.9]);
	const y = useTransform(scrollYProgress, [0.6, 1], [0, -100]);

	return (
		<motion.div
			ref={ref}
			className={`${styles.HomeCollaborations} ${className}`}
			style={{
				y,
				scale,
				transformStyle: 'preserve-3d',
			}}
		>
			<section id="collaborations">
				<h2>
					<MaskText phrases={[data.title ?? '']} />
				</h2>
				<div className={styles.portfolio__collaborations}>
					{logoComponents.map(({ Component, name, url }) => (
						<Link
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.collaborations__companies}
							key={name}
						>
							<Component />
						</Link>
					))}
				</div>
			</section>
		</motion.div>
	);
};

export default HomeCollaborations;
