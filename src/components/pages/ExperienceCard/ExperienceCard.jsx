import PropTypes from 'prop-types';
import styles from './ExperienceCard.module.scss';

import { BsPatchCheckFill } from 'react-icons/bs';

const ExperienceCard = ({ tech, experience }) => {
	return (
		<article
			className={styles['experience-card__details']}
			data-aos="fade-up"
			data-aos-duration="1400"
			data-aos-once="true"
		>
			<BsPatchCheckFill className={styles['experience-card__icon']} />
			<div>
				<h4>{tech}</h4>
				<small>{experience}</small>
			</div>
		</article>
	);
};

ExperienceCard.propTypes = {
	tech: PropTypes.string.isRequired,
	experience: PropTypes.string.isRequired,
};

export default ExperienceCard;
