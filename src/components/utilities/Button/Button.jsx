'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import styles from './Button.module.scss';

const Button = (props) => {
	const { text, variant, className } = props;

	return (
		<button
			className={`${styles.Button} ${
				styles[`button__${variant}`]
			} ${className}`}
			type="submit"
			aria-label="submit"
		>
			<motion.div className="button__slider">
				<div className="button__el">
					<div className="button__PerspectiveText">
						<p>{text}</p>
						<p>{text}</p>
					</div>
				</div>
			</motion.div>
		</button>
	);
};

Button.displayName = 'Button';

Button.defaultProps = {
	className: '',
	variant: '',
};

Button.propTypes = {
	text: PropTypes.string,
	className: PropTypes.string,
	variant: PropTypes.string,
};

export default Button;
