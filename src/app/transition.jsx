'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { text, curve, translate } from '../helpers/animations';

const anim = (variants) => {
	return {
		variants,
		initial: 'initial',
		animate: 'enter',
		exit: 'exit',
	};
};

export default function Curve({ children, backgroundColor }) {
	const [dimensions, setDimensions] = useState({
		width: null,
		height: null,
	});

	useEffect(() => {
		function resize() {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		resize();
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, []);

	return (
		<AnimatePresence mode="wait">
			<div className="page curve" style={{ backgroundColor }}>
				<div
					style={{ opacity: dimensions.width == null ? 1 : 0 }}
					className="background"
				/>
				<motion.div className="welcome" {...anim(text)}>
					<motion.p
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						Welcome.
					</motion.p>
				</motion.div>
				{dimensions.width != null && <SVG {...dimensions} />}
				{children}
			</div>
		</AnimatePresence>
	);
}

Curve.propTypes = {
	children: PropTypes.object.isRequired,
	backgroundColor: PropTypes.string,
};

const SVG = ({ height, width }) => {
	const initialPath = `
        M0 300 
        Q${width / 2} 0 ${width} 300
        L${width} ${height + 300}
        Q${width / 2} ${height + 600} 0 ${height + 300}
        L0 0
    `;

	const targetPath = `
        M0 300
        Q${width / 2} 0 ${width} 300
        L${width} ${height}
        Q${width / 2} ${height} 0 ${height}
        L0 0
    `;

	return (
		<motion.svg className={'motion-svg'} {...anim(translate)}>
			<motion.path {...anim(curve(initialPath, targetPath))} />
		</motion.svg>
	);
};

SVG.propTypes = {
	height: PropTypes.string,
	width: PropTypes.string,
};
