'use client';
import { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { useLenis } from '@studio-freight/react-lenis';

import styles from './Navbar.module.scss';

import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { BiBook, BiMessageSquareDetail } from 'react-icons/bi';
import { RiServiceLine } from 'react-icons/ri';

function Navbar() {
	const [activeNav, setActiveNav] = useState('home');

	const lenis = useLenis();

	const handleScroll = (to) => {
		if (lenis) {
			lenis.scrollTo(`#${to}`, {
				duration: 2,
			});
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			const sections = ['home', 'about', 'experience', 'services', 'contact'];
			const scrollPosition = window.scrollY;

			const activeSection = sections.find((section) => {
				const element = document.getElementById(section);
				if (element) {
					const elementTop = element.offsetTop;
					const elementBottom = elementTop + element.offsetHeight;
					return scrollPosition >= elementTop && scrollPosition < elementBottom;
				}
				return false;
			});

			if (activeSection) {
				setActiveNav(activeSection);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<nav className={styles['navbar']}>
			<Link
				to="home"
				onClick={() => {
					setActiveNav('home');
					handleScroll('home');
				}}
				className={styles[activeNav === 'home' ? 'active' : '']}
			>
				<AiOutlineHome />
			</Link>
			<Link
				to="about"
				onClick={() => {
					setActiveNav('about');
					handleScroll('about');
				}}
				className={styles[activeNav === 'about' ? 'active' : '']}
			>
				<AiOutlineUser />
			</Link>
			<Link
				to="experience"
				onClick={() => {
					setActiveNav('experience');
					handleScroll('experience');
				}}
				className={styles[activeNav === 'experience' ? 'active' : '']}
			>
				<BiBook />
			</Link>
			<Link
				to="services"
				onClick={() => {
					setActiveNav('services');
					handleScroll('services');
				}}
				className={styles[activeNav === 'services' ? 'active' : '']}
			>
				<RiServiceLine />
			</Link>
			<Link
				to="contact"
				onClick={() => {
					setActiveNav('contact');
					handleScroll('contact');
				}}
				className={styles[activeNav === 'contact' ? 'active' : '']}
			>
				<BiMessageSquareDetail />
			</Link>
		</nav>
	);
}

export default Navbar;
