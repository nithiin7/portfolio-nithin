import styles from './Layout.module.scss';
import PropTypes from 'prop-types';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function Layout(props) {
	return (
		<div className={styles['layout']}>
			{props.children}
			<Navbar />
			<Footer />
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.object.isRequired,
	data: PropTypes.object,
};

export default Layout;
