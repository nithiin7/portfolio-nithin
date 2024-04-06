'use client';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { cardData } from 'helpers/constants';

import styles from './HomeAbout.module.scss';
import Button from 'components/utilities/Button';
import Paragraph from 'components/utilities/Paragraph/Paragraph';

const HomeAbout = (props) => {
	const { className, variant, data } = props;
	const text = `👋 Hi, I'm Nithin, a passionate Full Stack Developer from Kochi, Kerala. Specializing in frontend magic—from captivating UI effects to dynamic animations—I thrive on ambitious projects that push boundaries. Beyond coding, you'll find me immersed in football, gaming, TV series, or admiring the latest in automobiles. Lets craft exceptional experiences together!`;

	return (
		<div
			className={`${styles.HomeAbout} ${
				styles[`HomeAbout__${variant}`]
			} ${className}`}
		>
			<section id="about">
				<h5>{data.items[0].title}</h5>
				<h2>{data.items[0].subTitle}</h2>
				<div className={'portfolio__about'}>
					<div className={'about__me'}>
						<div className={'about__me-image'}>
							<Image
								src={data.items[1].image.url}
								alt="about-me"
								height={1000}
								width={1000}
								quality={100}
							/>
						</div>
					</div>
					<div className={'about__content'}>
						<div className={'about__cards'}>
							{cardData.map((card, index) => (
								<article key={index} className={'about__card'}>
									{card.icon}
									<h5>{card.title}</h5>
									<small>{card.description}</small>
								</article>
							))}
						</div>
						<Paragraph value={text} />
						<div className={'about__icon'}>
							<Button
								href={'contact'}
								classModifier={'Button--primary'}
								data={'Let’s make something special.'}
								type={'scroll_link'}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

HomeAbout.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
};

HomeAbout.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
};

export default HomeAbout;
