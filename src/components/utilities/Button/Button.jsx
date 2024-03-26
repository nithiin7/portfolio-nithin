import { useLenis } from '@studio-freight/react-lenis';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';

import styles from './Button.module.scss';

const Button = ({ classModifier, href, data, type }) => {
	const lenis = useLenis();

	const handleScroll = (to) => {
		if (lenis) {
			lenis.scrollTo(`#${to}`, {
				duration: 2,
			});
		}
	};

	if (type === 'scroll_link') {
		return (
			<ScrollLink
				className={styles[`${classModifier}`]}
				to={href}
				onClick={() => handleScroll(href)}
			>
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
};

Button.propTypes = {
	classModifier: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	data: PropTypes.string.isRequired,
	type: PropTypes.string,
};

export default Button;
