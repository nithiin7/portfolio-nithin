import PropTypes from "prop-types";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import styles from "./ButtonPrimary.module.scss";

function Button({ classModifier, href, data, type }) {
  if (type === "scroll_link") {
    return (
      <ScrollLink
        className={styles[`${classModifier}`]}
        to={href}
      >
        {data}
      </ScrollLink>
    );
  } else {
    return (
      <Link
        className={styles[`${classModifier}`]}
        href={href}
        target="_blank"
      >
        {data}
      </Link>
    );
  }
}

Button.propTypes = {
  classModifier: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default Button;
