import styles from './ButtonPrimary.module.scss';
import PropTypes from 'prop-types';

function ButtonPrimary({ classModifier, href, data }) {
	return (
		<a className={styles[`${classModifier}`]} href={href}>
			{data}
		</a>
	);
}

ButtonPrimary.propTypes = {
	classModifier: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	data: PropTypes.string.isRequired,
};

export default ButtonPrimary;
