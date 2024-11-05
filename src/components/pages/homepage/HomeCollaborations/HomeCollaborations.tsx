import styles from './HomeCollaborations.module.scss';

import MaskText from 'components/utilities/MaskText/MaskText';
import WhiteRabbitLogo from 'assets/logos/white-rabbit.svg';
import SpotifyLogo from 'assets/logos/spotify.svg';
import GameAwardsLogo from 'assets/logos/game-awards.svg';

interface HomeCollaborationsProps {
	className?: string;
	data?: {
		title?: string;
	};
}

const logoComponents = [
	{ Component: WhiteRabbitLogo, name: 'WhiteRabbitLogo' },
	{ Component: SpotifyLogo, name: 'SpotifyLogo' },
	{ Component: GameAwardsLogo, name: 'GameAwardsLogo' },
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
const HomeCollaborations: React.FC<HomeCollaborationsProps> = ({
	className = '',
	data = {},
}) => (
	<div className={`${styles.HomeCollaborations} ${className}`}>
		<section id="collaborations">
			<h2>
				<MaskText phrases={[data.title ?? '']} />
			</h2>
			<div className="portfolio__collaborations">
				{logoComponents.map(({ Component, name }) => (
					<div className="Collaborations__companies" key={name}>
						<Component />
					</div>
				))}
			</div>
		</section>
	</div>
);

export default HomeCollaborations;
