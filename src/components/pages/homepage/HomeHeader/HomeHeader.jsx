'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import styles from './HomeHeader.module.scss';
import Logo from 'assets/images/nav-logo.svg';
import Cursor from 'components/utilities/Cursor/Cursor';
import MaskText from 'components/utilities/MaskText/MaskText';

const settings = {
	damping: 100,
	stiffness: 600,
	maxDistance: 300,
	intensity: 0.1,
};

const HomeHeader = (props) => {
	const { className, variant, data } = props;

	const [componentRef, setComponentRef] = useState(null);
	const [isHovered, setIsHovered] = useState(false);

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = {
		damping: settings.damping,
		stiffness: settings.stiffness,
	};
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	useEffect(() => {
		const calculateDistance = (e) => {
			if (componentRef) {
				const rect = componentRef.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;
				const distanceX = e.clientX - centerX;
				const distanceY = e.clientY - centerY;

				if (
					Math.abs(distanceX) < settings.maxDistance &&
					Math.abs(distanceY) < settings.maxDistance
				) {
					const proximityFactor =
						1 -
						Math.max(Math.abs(distanceX), Math.abs(distanceY)) /
							settings.maxDistance;
					x.set(distanceX * proximityFactor * settings.intensity);
					y.set(distanceY * proximityFactor * settings.intensity);
				} else {
					x.set(0);
					y.set(0);
				}
			}
		};

		const handleMouseMove = (e) => {
			calculateDistance(e);
		};

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [componentRef]);

	return (
		<div
			className={`${styles.HomeHeader} ${
				styles[`HomeHeader__${variant}`]
			} ${className}`}
		>
			<div className="header__nav">
				<motion.div
					ref={setComponentRef}
					style={{
						x: springX,
						y: springY,
						zIndex: 99,
					}}
				>
					<Image src={Logo} alt="logo" height={100} width={100}></Image>
				</motion.div>
			</div>
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
				<div className="header__description">
					<h1
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						data-aos="fade-up"
						data-aos-duration="1000"
						data-aos-once="true"
						data-aos-delay="800"
					>
						<MaskText phrases={[data.items[0].title]} />
						<MaskText phrases={[data?.items[0].subTitle]} />
					</h1>
					<p
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						data-aos-delay="800"
					>
						A web developer & web designer propelling visions to reality.
					</p>
				</div>
			</header>
			<Cursor isHovered={isHovered} />
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
