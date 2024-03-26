'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';

import styles from './HomeHeader.module.scss';

const HomeHeader = (props) => {
	const { className, variant, data } = props;

	const [mousePosition, setMousePosition] = useState({
		x: 0,
		y: 0,
	});
	const [cursorVariant, setCursorVariant] = useState('default');

	const variants = {
		default: {
			x: mousePosition.x - 16,
			y: mousePosition.y - 16,
		},
		text: {
			height: 150,
			width: 150,
			x: mousePosition.x - 75,
			y: mousePosition.y - 75,
			backgroundColor: 'white',
			mixBlendMode: 'difference',
		},
	};

	const textEnter = () => setCursorVariant('text');
	const textLeave = () => setCursorVariant('default');

	useEffect(() => {
		const handleMouseMove = debounce((e) => {
			setMousePosition({
				x: e.clientX,
				y: e.clientY,
			});
		}, 4);

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<div
			className={`${styles.HomeHeader} ${
				styles[`HomeHeader__${variant}`]
			} ${className}`}
		>
			<header id="home" className={'portfolio__header'}>
				<svg
					width="1186"
					height="1186"
					viewBox="0 0 1186 1186"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{
						opacity: 1,
						zIndex: -20,
						transform: 'translateX(-50%) translateY(-50%) scale(1)',
					}}
				>
					<circle
						cx="593"
						cy="593"
						r="593"
						fill="url(#paint0_linear_4949_267)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_4949_267"
							x1="593"
							y1="0"
							x2="593"
							y2="1186"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#DDDDD5" />
							<stop offset="1" stopColor="#DDDDD5" stopOpacity="0" />
						</linearGradient>
					</defs>
				</svg>
				<div
					className="header__description"
					onMouseEnter={textEnter}
					onMouseLeave={textLeave}
				>
					<h1
						data-aos="fade-up"
						data-aos-duration="1000"
						data-aos-once="true"
						data-aos-delay="800"
					>
						<span>{data.items[0].title}</span>
						<span>{data?.items[0].subTitle}</span>
					</h1>
					<p
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						data-aos-delay="1000"
					>
						A web developer & web designer propelling visions to reality.
					</p>
				</div>
				{cursorVariant !== 'default' && (
					<motion.div
						className="cursor"
						variants={variants}
						animate={cursorVariant}
					/>
				)}
			</header>
		</div>
	);
};

HomeHeader.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
};

HomeHeader.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
};

export default HomeHeader;
