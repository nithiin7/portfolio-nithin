"use client";
import Image from "next/image";
import Link from "next/link";
import { useLenis } from "@studio-freight/react-lenis";
import { Link as ScrollLink } from "react-scroll";

import Logo from "assets/images/Logo.png";
import styles from "./Footer.module.scss";
import { footerLinks, socials } from "helpers/constants.js";

function Footer() {
  const lenis = useLenis();

  const handleScroll = to => {
    if (lenis) {
      lenis.scrollTo(`#${to}`, {
        duration: 2,
      });
    }
  };

  return (
    <footer className={styles["footer"]}>
      <div
        data-aos="fade-up"
        data-aos-duration="900"
        data-aos-once="true"
        className={styles["footer__logo"]}
      >
        <Image
          src={Logo}
          alt="logo"
          width={1000}
          height={1000}
          quality={100}
        />
      </div>
      <ul className={styles["footer__permalinks"]}>
        {footerLinks.map(link => (
          <li
            key={link.key}
            data-aos="fade-up"
            data-aos-duration={link.duration}
            data-aos-once="true"
          >
            <ScrollLink
              to={link.href}
              onClick={() => {
                handleScroll(link.href);
              }}
            >
              {link.key}
            </ScrollLink>
          </li>
        ))}
      </ul>
      <div className={styles["footer__socials"]}>
        {socials.map((social, index) => (
          <Link
            key={index}
            title={social.title}
            data-aos="fade-up"
            data-aos-offset="0"
            data-aos-duration={social.duration}
            data-aos-once="true"
            href={social.link}
          >
            {social.icon}
          </Link>
        ))}
      </div>

      <div
        data-aos="fade-up"
        data-aos-offset="0"
        data-aos-duration="1500"
        data-aos-once="true"
        className={styles["footer__copyright"]}
      >
        <small>
          &copy; Nithin Pradeep. All rights reserved
        </small>
      </div>
    </footer>
  );
}

export default Footer;
