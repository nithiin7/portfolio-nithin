import styles from './ButtonPrimary.module.scss';
import { Link } from 'react-scroll';
import PropTypes from 'prop-types';

function ButtonPrimary({ classModifier, href, data }) {
	return (
		<Link className={styles[`${classModifier}`]} to={href}>
			{data}
		</Link>
	);
}

ButtonPrimary.propTypes = {
	classModifier: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	data: PropTypes.string.isRequired,
};

export default ButtonPrimary;
