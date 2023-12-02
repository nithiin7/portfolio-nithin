import PropTypes from "prop-types";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Layout(props) {
  return (
    <div className="layout">
      {props.children}
      <Navbar />
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  props: PropTypes.object,
  children: PropTypes.object.isRequired,
};

export default Layout;
