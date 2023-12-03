import PropTypes from "prop-types";
import styles from "./HomeExperience.module.scss";

const HomeExperience = props => {
  const { className, variant } = props;
  return (
    <div
      className={`${styles.HomeExperience} ${
        styles[`HomeExperience__${variant}`]
      } ${className}`}
    ></div>
  );
};

HomeExperience.defaultProps = {
  variant: "default",
  className: "",
};

HomeExperience.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.string,
};

export default HomeExperience;
