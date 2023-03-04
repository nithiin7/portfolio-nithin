import styles from './Layout.module.scss';
import PropTypes from 'prop-types';

function Layout(props){
    return(
        <div className={styles['layout']}>
            {props.children}
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.object.isRequired,
    data: PropTypes.object
}

export default Layout;