import styles from "./ServiceCard.module.scss";
import { BiCheck } from "react-icons/bi";
import PropTypes from "prop-types";

function ServiceCard({ heading, list }) {
  return (
    <article className={styles["service-card"]}>
      <div className={styles["service-card__head"]}>
        <h3
          data-aos="fade-up"
          data-aos-duration="1300"
          data-aos-once="true"
        >
          {heading}
        </h3>
      </div>
      <ul className={styles["service-card__list"]}>
        {list.map((item, index) => (
          <li
            key={index}
            data-aos="fade-up"
            data-aos-duration="1400"
            data-aos-once="true"
          >
            <BiCheck
              className={styles["service-card__icon"]}
            />
            <p>{item}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

ServiceCard.propTypes = {
  heading: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
};

export default ServiceCard;
