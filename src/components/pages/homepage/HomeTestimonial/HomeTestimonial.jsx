'use client';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';

import styles from './HomeTestimonial.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeTestimonial = (props) => {
	const { className, variant, data, testimonial } = props;
	return (
		<div
			className={`${styles.HomeTestimonial} ${
				styles[`HomeTestimonial__${variant}`]
			} ${className}`}
		>
			<section id="testimonials">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{data.title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{data.subTitle}
				</h2>
				<div data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">
					<Swiper
						className="portfolio__testimonials"
						modules={[Pagination]}
						navigation
						spaceBetween={40}
						slidesPerView={1}
						pagination={{ clickable: true }}
					>
						{testimonial.map((item, index) => {
							return (
								<SwiperSlide key={index} className="testimonial__container">
									<div className="testimonial__avatar">
										<Image
											src={item.avatar.url}
											alt="Avatar"
											width={1000}
											height={1000}
											priority
											quality={100}
										/>
									</div>
									<h3 className="testimonial__name">{item.reviewer}</h3>
									<h5>{item.institution}</h5>
									<small className="testimonial__review">{item.review}</small>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>
			</section>
		</div>
	);
};

HomeTestimonial.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
	testimonial: {},
};

HomeTestimonial.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
	testimonial: PropTypes.array,
};

export default HomeTestimonial;
