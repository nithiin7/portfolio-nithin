import Image from "next/image";
import styles from "./PortfolioCard.module.scss";
import PropTypes from "prop-types";

import Button from "components/utilities/Button";

function PortfolioCard({ id, image, title, github, demo }) {
  return (
    <article
      data-aos="fade-up"
      data-aos-duration="1500"
      data-aos-once="true"
      key={id}
      className={styles["portfolio-card__item"]}
    >
      <div className={styles["portfolio-card__image"]}>
        <Image
          src={image}
          alt={title}
          width={1000}
          height={1000}
          quality={100}
        />
      </div>
      <h3>{title}</h3>
      <div className={styles["portfolio-card__cta"]}>
        <Button
          href={github}
          classModifier={"Button"}
          data={"Github"}
        />
        <Button
          href={demo}
          classModifier={"Button"}
          data={"Live Demo"}
          type={"external_link"}
        />
      </div>
    </article>
  );
}

PortfolioCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  demo: PropTypes.string.isRequired,
};

export default PortfolioCard;
