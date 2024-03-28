'use client';
import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import PropTypes from 'prop-types';

import styles from './Paragraph.module.scss';
import Word from '../Word/Word';

const Paragraph = (props) => {
	const { className, variant, value } = props;

	const element = useRef(null);
	const { scrollYProgress } = useScroll({
		target: element,
		offset: ['start 0.9', 'start 0.45'],
	});

	const words = value.split(' ');

	return (
		<p
			className={`${styles.Paragraph} ${
				styles[`Paragraph__${variant}`]
			} ${className}`}
			ref={element}
		>
			{words.map((word, i) => {
				const start = i / words.length;
				const end = start + 1 / words.length;
				return (
					<Word key={i} range={[start, end]} progress={scrollYProgress}>
						{word}
					</Word>
				);
			})}
		</p>
	);
};

Paragraph.defaultProps = {
	variant: 'default',
	className: '',
	value: '',
};

Paragraph.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	value: PropTypes.string,
};

export default Paragraph;
