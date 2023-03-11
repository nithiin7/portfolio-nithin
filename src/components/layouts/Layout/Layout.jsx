import styles from './Layout.module.scss';
import PropTypes from 'prop-types';
import Navbar from '../Navbar/Navbar';

function Layout(props) {
	return (
		<div className={styles['layout']}>
			{props.children}
			<Navbar />
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.object.isRequired,
	data: PropTypes.object,
};

export default Layout;
