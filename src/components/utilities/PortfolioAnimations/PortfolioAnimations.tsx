'use client';

import { motion, useInView, useAnimation } from 'motion/react';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

interface PortfolioAnimationsProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	animation?: 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
}

export const PortfolioAnimations: React.FC<PortfolioAnimationsProps> = ({
	children,
	className = '',
	delay = 0,
	animation = 'fadeIn',
}) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-50px' });
	const controls = useAnimation();

	useEffect(() => {
		if (isInView) {
			controls.start('visible');
		}
	}, [isInView, controls]);

	const animations = {
		fadeIn: {
			hidden: { opacity: 0 },
			visible: {
				opacity: 1,
				transition: {
					duration: 0.6,
					delay,
					ease: [0.25, 0.46, 0.45, 0.94],
				},
			},
		},
		slideUp: {
			hidden: { opacity: 0, y: 30 },
			visible: {
				opacity: 1,
				y: 0,
				transition: {
					duration: 0.6,
					delay,
					ease: [0.25, 0.46, 0.45, 0.94],
				},
			},
		},
		slideInLeft: {
			hidden: { opacity: 0, x: -30 },
			visible: {
				opacity: 1,
				x: 0,
				transition: {
					duration: 0.6,
					delay,
					ease: [0.25, 0.46, 0.45, 0.94],
				},
			},
		},
		slideInRight: {
			hidden: { opacity: 0, x: 30 },
			visible: {
				opacity: 1,
				x: 0,
				transition: {
					duration: 0.6,
					delay,
					ease: [0.25, 0.46, 0.45, 0.94],
				},
			},
		},
		scaleIn: {
			hidden: { opacity: 0, scale: 0.95 },
			visible: {
				opacity: 1,
				scale: 1,
				transition: {
					duration: 0.6,
					delay,
					ease: [0.25, 0.46, 0.45, 0.94],
				},
			},
		},
	};

	return (
		<motion.div
			ref={ref}
			variants={animations[animation]}
			initial="hidden"
			animate={controls}
			className={className}
		>
			{children}
		</motion.div>
	);
};

interface StaggeredContainerProps {
	children: React.ReactNode;
	className?: string;
	staggerDelay?: number;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
	children,
	className = '',
	staggerDelay = 0.1,
}) => {
	const containerRef = useRef(null);
	const isInView = useInView(containerRef, { once: true, margin: '-50px' });

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: staggerDelay,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.25, 0.46, 0.45, 0.94],
			},
		},
	};

	return (
		<motion.div
			ref={containerRef}
			variants={containerVariants}
			initial="hidden"
			animate={isInView ? 'visible' : 'hidden'}
			className={className}
		>
			{React.Children.map(children, (child, index) => (
				<motion.div key={index} variants={itemVariants}>
					{child}
				</motion.div>
			))}
		</motion.div>
	);
};

interface AnimatedImageProps {
	src: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
	src,
	alt,
	width,
	height,
	className = '',
}) => {
	const imageRef = useRef(null);
	const isInView = useInView(imageRef, { once: true, margin: '-50px' });

	return (
		<motion.div
			ref={imageRef}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={
				isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
			}
			transition={{
				duration: 0.8,
				ease: [0.25, 0.46, 0.45, 0.94],
			}}
			className={className}
		>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				style={{ width: '100%', height: 'auto' }}
			/>
		</motion.div>
	);
};
