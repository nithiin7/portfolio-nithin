'use client';
import gsap from 'gsap';
import type { Variants } from 'motion/react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import type { FC } from 'react';

import type { PortfolioItem } from 'types/portfolio';

import styles from './PortfolioModal.module.scss';

interface PortfolioModalProps {
	modal: { active: boolean; index: number };
	projects: PortfolioItem[];
}

const PortfolioModal: FC<PortfolioModalProps> = ({ modal, projects }) => {
	const scaleAnimation: Variants = {
		initial: { scale: 0, x: '-50%', y: '-50%' },
		enter: {
			scale: 1,
			x: '-50%',
			y: '-50%',
			transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
		},
		closed: {
			scale: 0,
			x: '-50%',
			y: '-50%',
			transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
		},
	};

	const { active, index } = modal;
	const modalContainer = useRef<HTMLDivElement>(null);
	const cursor = useRef<HTMLDivElement>(null);
	const cursorLabel = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!modalContainer.current || !cursor.current || !cursorLabel.current)
			return;

		const xMoveContainer = gsap.quickTo(modalContainer.current, 'left', {
			duration: 0.8,
			ease: 'power3',
		});
		const yMoveContainer = gsap.quickTo(modalContainer.current, 'top', {
			duration: 0.8,
			ease: 'power3',
		});

		const xMoveCursor = gsap.quickTo(cursor.current, 'left', {
			duration: 0.5,
			ease: 'power3',
		});
		const yMoveCursor = gsap.quickTo(cursor.current, 'top', {
			duration: 0.5,
			ease: 'power3',
		});

		const xMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'left', {
			duration: 0.45,
			ease: 'power3',
		});
		const yMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'top', {
			duration: 0.45,
			ease: 'power3',
		});

		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			xMoveContainer(clientX);
			yMoveContainer(clientY);
			xMoveCursor(clientX);
			yMoveCursor(clientY);
			xMoveCursorLabel(clientX);
			yMoveCursorLabel(clientY);
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<>
			<motion.div
				ref={modalContainer}
				variants={scaleAnimation}
				initial="initial"
				animate={active ? 'enter' : 'closed'}
				className={styles.PortfolioModal}
			>
				<div
					style={{
						transform: `translateY(${index * -100}%)`,
					}}
					className={styles.PortfolioModal__floating_image_wrapper}
				>
					{projects.map((project, idx) => {
						return (
							<div
								className={styles.PortfolioModal__modal}
								style={{ backgroundColor: project.color || '#f0f0f0' }}
								key={`modal_${idx}`}
							>
								{project.image?.url && (
									<Image
										src={project.image.url}
										width={300}
										height={300}
										alt={project.title || 'Project image'}
										priority={idx === index}
									/>
								)}
							</div>
						);
					})}
				</div>
			</motion.div>
			<motion.div
				ref={cursor}
				className={styles.PortfolioModal__cursor}
				variants={scaleAnimation}
				initial="initial"
				animate={active ? 'enter' : 'closed'}
			/>
			<motion.div
				ref={cursorLabel}
				className={styles.PortfolioModal__cursor_label}
				variants={scaleAnimation}
				initial="initial"
				animate={active ? 'enter' : 'closed'}
			>
				View
			</motion.div>
		</>
	);
};

export default PortfolioModal;
