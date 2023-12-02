import { useState } from "react";
import { Link } from "react-scroll";
import styles from "./Navbar.module.scss";

import {
  AiOutlineHome,
  AiOutlineUser,
} from "react-icons/ai";
import {
  BiBook,
  BiMessageSquareDetail,
} from "react-icons/bi";
import { RiServiceLine } from "react-icons/ri";

function Navbar() {
  const [activeNav, setActiveNav] = useState("home");
  return (
    <nav className={styles["navbar"]}>
      <Link
        to="home"
        onClick={() => setActiveNav("home")}
        className={
          styles[activeNav === "home" ? "active" : ""]
        }
      >
        <AiOutlineHome />
      </Link>
      <Link
        to="about"
        onClick={() => setActiveNav("about")}
        className={
          styles[activeNav === "about" ? "active" : ""]
        }
      >
        <AiOutlineUser />
      </Link>
      <Link
        to="experience"
        onClick={() => setActiveNav("experience")}
        className={
          styles[activeNav === "experience" ? "active" : ""]
        }
      >
        <BiBook />
      </Link>
      <Link
        to="services"
        onClick={() => setActiveNav("services")}
        className={
          styles[activeNav === "services" ? "active" : ""]
        }
      >
        <RiServiceLine />
      </Link>
      <Link
        to="contact"
        onClick={() => setActiveNav("contact")}
        className={
          styles[activeNav === "contact" ? "active" : ""]
        }
      >
        <BiMessageSquareDetail />
      </Link>
    </nav>
  );
}

export default Navbar;
