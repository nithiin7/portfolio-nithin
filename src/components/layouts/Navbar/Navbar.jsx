import styles from './Navbar.module.scss';
import { AiOutlineHome } from 'react-icons/ai';
import { AiOutlineUser } from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';
import { RiServiceLine } from 'react-icons/ri';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { useState } from 'react';

function Navbar() {
	const [activeNav, setActiveNav] = useState('#');
	return (
		<nav className={styles['navbar']}>
			<a
				href="#"
				onClick={() => setActiveNav('#')}
				className={styles[activeNav === '#' ? 'active' : '']}
			>
				<AiOutlineHome />
			</a>
			<a
				href="#about"
				onClick={() => setActiveNav('#about')}
				className={styles[activeNav === '#about' ? 'active' : '']}
			>
				<AiOutlineUser />
			</a>
			<a
				href="#experience"
				onClick={() => setActiveNav('#experience')}
				className={styles[activeNav === '#experience' ? 'active' : '']}
			>
				<BiBook />
			</a>
			<a
				href="#services"
				onClick={() => setActiveNav('#services')}
				className={styles[activeNav === '#services' ? 'active' : '']}
			>
				<RiServiceLine />
			</a>
			<a
				href="#contact"
				onClick={() => setActiveNav('#contact')}
				className={styles[activeNav === '#contact' ? 'active' : '']}
			>
				<BiMessageSquareDetail />
			</a>
		</nav>
	);
}

export default Navbar;
