import styles from './ButtonPrimary.module.scss';
import PropTypes from 'prop-types';

function ButtonPrimary({ classModifier, href, download, data }) {
	return (
		<a className={styles[`${classModifier}`]} href={href}>
			{data}
		</a>
	);
}

ButtonPrimary.propTypes = {
	classModifier: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	download: PropTypes.string,
	data: PropTypes.string.isRequired,
};

export default ButtonPrimary;
