import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.scss';

import { AiOutlineHome } from 'react-icons/ai';
import { AiOutlineUser } from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';
import { RiServiceLine } from 'react-icons/ri';
import { BiMessageSquareDetail } from 'react-icons/bi';

function Navbar() {
	const [activeNav, setActiveNav] = useState('#');
	return (
		<nav className={styles['navbar']}>
			<Link
				href="#"
				onClick={() => setActiveNav('#')}
				className={styles[activeNav === '#' ? 'active' : '']}
			>
				<AiOutlineHome />
			</Link>
			<Link
				href="#about"
				onClick={() => setActiveNav('#about')}
				className={styles[activeNav === '#about' ? 'active' : '']}
			>
				<AiOutlineUser />
			</Link>
			<Link
				href="#experience"
				onClick={() => setActiveNav('#experience')}
				className={styles[activeNav === '#experience' ? 'active' : '']}
			>
				<BiBook />
			</Link>
			<Link
				href="#services"
				onClick={() => setActiveNav('#services')}
				className={styles[activeNav === '#services' ? 'active' : '']}
			>
				<RiServiceLine />
			</Link>
			<Link
				href="#contact"
				onClick={() => setActiveNav('#contact')}
				className={styles[activeNav === '#contact' ? 'active' : '']}
			>
				<BiMessageSquareDetail />
			</Link>
		</nav>
	);
}

export default Navbar;
