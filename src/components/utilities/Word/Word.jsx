import PropTypes from 'prop-types';
import { motion, useTransform } from 'framer-motion';

import styles from './Word.module.scss';

const Word = (props) => {
	const { className, variant, children, range, progress } = props;

	const opacity = useTransform(progress, range, [0, 1]);

	return (
		<span
			className={`${styles.Word} ${styles[`Word__${variant}`]} ${className}`}
		>
			<span className="Word__shadow">{children}</span>
			<motion.span style={{ opacity: opacity }}>{children}</motion.span>
		</span>
	);
};

Word.defaultProps = {
	variant: 'default',
	className: '',
};

Word.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.node,
	range: PropTypes.string,
	progress: PropTypes.string,
};

export default Word;
