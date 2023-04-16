import styles from './ButtonPrimary.module.scss';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import PropTypes from 'prop-types';

function ButtonPrimary({ classModifier, href, data, type }) {
	if (type === 'scroll_link') {
		return (
			<ScrollLink className={styles[`${classModifier}`]} to={href}>
				{data}
			</ScrollLink>
		);
	} else {
		return (
			<Link className={styles[`${classModifier}`]} href={href} target="_blank">
				{data}
			</Link>
		);
	}
}

ButtonPrimary.propTypes = {
	classModifier: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	data: PropTypes.string.isRequired,
};

export default ButtonPrimary;
