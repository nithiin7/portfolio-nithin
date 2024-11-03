'use client';
import Image from 'next/image';

import styles from './HomeAbout.module.scss';
import MaskText from 'components/utilities/MaskText/MaskText';

interface HomeAboutProps {
	className?: string;
	data?: {
		items: {
			title: string;
			image: {
				url: string;
			};
		}[];
	};
}

const HomeAbout: React.FC<HomeAboutProps> = ({
	className = '',
	data = {
		items: [
			{
				title: '',
				image: {
					url: '',
				},
			},
		],
	},
}) => {
	const text = `A passionate Full Stack Developer from Kochi, Kerala. Specializing in frontend magic—from captivating UI effects to dynamic animations—I thrive on ambitious projects that push boundaries. Beyond coding, you'll find me immersed in football, gaming, TV series, or admiring the latest in automobiles. Lets craft exceptional experiences together!`;

	return (
		<div className={`${styles.HomeAbout} ${className}`}>
			<section id="about">
				<div className="HomeAbout__container">
					<div className="HomeAbout__content">
						<h2>
							<MaskText phrases={[data.items?.[0]?.title || '']} />
						</h2>
						<svg
							className="HomeAbout__image-left"
							viewBox="0 0 709 300"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<rect width="709" height="300" rx="169.963" fill="#AFAF9D" />
						</svg>
						<svg
							className="HomeAbout__image-right"
							viewBox="0 0 594 209"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<rect
								x="594"
								y="209"
								width="594"
								height="209"
								rx="126.5"
								transform="rotate(-180 594 209)"
								fill="#E8E8E3"
							/>
						</svg>
						<div className="HomeAbout__image">
							<Image
								src={data.items?.[1]?.image.url || ''}
								alt="about-me"
								height={1000}
								width={1000}
								quality={100}
							/>
							<div className="HomeAbout__gradient" aria-hidden="true"></div>
						</div>
					</div>
					<p className="HomeAbout__description">
						<span>{text}</span>
					</p>
				</div>
			</section>
		</div>
	);
};

export default HomeAbout;
