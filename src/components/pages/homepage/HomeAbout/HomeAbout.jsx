"use client";
import Image from "next/image";
import PropTypes from "prop-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import { cardData } from "helpers/constants";
import styles from "./HomeAbout.module.scss";
import Button from "components/utilities/Button";

const HomeAbout = props => {
  const { className, variant, data } = props;
  return (
    <div
      className={`${styles.HomeAbout} ${
        styles[`HomeAbout__${variant}`]
      } ${className}`}
    >
      <section id="about">
        <h5
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-once="true"
        >
          {data.items[0].title}
        </h5>
        <h2
          data-aos="fade-up"
          data-aos-duration="1200"
          data-aos-once="true"
        >
          {data.items[0].subTitle}
        </h2>
        <div
          data-aos="fade-up"
          data-aos-duration="1300"
          data-aos-once="true"
          className={"portfolio__about"}
        >
          <div
            className={"about__me"}
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-once="true"
          >
            <div className={"about__me-image"}>
              <Image
                src={data.items[1].image.url}
                alt="about-me"
                height={1000}
                width={1000}
                quality={100}
              />
            </div>
          </div>
          <div className={"about__content"}>
            <div className={"about__cards"}>
              {cardData.map((card, index) => (
                <article
                  key={index}
                  className={"about__card"}
                  data-aos="fade-up"
                  data-aos-duration={card.duration}
                  data-aos-once="true"
                >
                  {card.icon}
                  <h5>{card.title}</h5>
                  <small>{card.description}</small>
                </article>
              ))}
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-once="true"
            >
              {documentToReactComponents(
                data.items[3].descriptionLong.json
              )}
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="1300"
              data-aos-once="true"
              className={"about__icon"}
            >
              <Button
                href={"contact"}
                classModifier={"Button--primary"}
                data={"Let’s make something special."}
                type={"scroll_link"}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

HomeAbout.defaultProps = {
  variant: "default",
  className: "",
  data: {},
};

HomeAbout.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.object,
};

export default HomeAbout;
