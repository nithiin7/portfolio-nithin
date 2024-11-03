import PropTypes from 'prop-types';

import styles from './HomeCollaborations.module.scss';
import MaskText from 'components/utilities/MaskText/MaskText';
import WhiteRabbitLogo from 'assets/logos/white-rabbit.svg';
import SpotifyLogo from 'assets/logos/spotify.svg';
import GameAwardsLogo from 'assets/logos/game-awards.svg';

const logoComponents = [
	{ Component: WhiteRabbitLogo, name: 'WhiteRabbitLogo' },
	{ Component: SpotifyLogo, name: 'SpotifyLogo' },
	{ Component: GameAwardsLogo, name: 'GameAwardsLogo' },
];

const HomeCollaborations = ({ className = '', data = {} }) => (
	<div className={`${styles.HomeCollaborations} ${className}`}>
		<section id="collaborations">
			<h2>
				<MaskText phrases={[data.title]} />
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

HomeCollaborations.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.shape({
		title: PropTypes.string.isRequired,
	}),
};

export default HomeCollaborations;
