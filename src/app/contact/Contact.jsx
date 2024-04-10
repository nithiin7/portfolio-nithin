'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import ContactForm from 'components/pages/contact/ContactForm';
import Logo from 'assets/images/nav-logo.svg';
import styles from './Contact.module.scss';
import Link from 'next/link';
import MaskText from 'components/utilities/MaskText/MaskText';

const settings = {
	damping: 100,
	stiffness: 600,
	maxDistance: 300,
	intensity: 0.1,
};

const Contact = () => {
	const [componentRef, setComponentRef] = useState(null);

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
		<div className={`${styles.Contact}`}>
			<header>
				<div className="contact__nav">
					<motion.div
						ref={setComponentRef}
						style={{
							x: springX,
							y: springY,
							zIndex: 99,
						}}
					>
						<Link href={'/'} aria-label="Back to home">
							<Image src={Logo} alt="logo" height={100} width={100}></Image>
						</Link>
					</motion.div>
				</div>
				<svg
					className="contact__bg"
					width="1186"
					height="1186"
					viewBox="0 0 1186 1186"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<circle
						cx="593"
						cy="593"
						r="593"
						fill="url(#paint0_linear_4949_267)"
					></circle>
					<defs>
						<linearGradient
							id="paint0_linear_4949_267"
							x1="593"
							y1="0"
							x2="593"
							y2="1186"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#DDDDD5"></stop>
							<stop offset="1" stopColor="#DDDDD5" stopOpacity="0"></stop>
						</linearGradient>
					</defs>
				</svg>
				<div className="Contact__header">
					<h1>
						<MaskText
							phrases={[`Say No More. Lets Bring your project to life`]}
						/>
					</h1>
				</div>
			</header>
			<section>
				<ContactForm />
			</section>
		</div>
	);
};

export default Contact;
