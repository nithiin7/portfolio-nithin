"use client";
import { useEffect } from "react";
import AOS from "aos";
import { ReactLenis } from "@studio-freight/react-lenis";
import PropTypes from "prop-types";

import "aos/dist/aos.css";

export default function Provider({ children }) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <main>
      <ReactLenis root>{children}</ReactLenis>
    </main>
  );
}

Provider.propTypes = {
  children: PropTypes.object.isRequired,
};
