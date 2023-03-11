import styles from './ButtonPrimary.module.scss';

function ButtonPrimary({ classModifier, href, download, data }) {
	return (
		<a className={styles[`${classModifier}`]} href={href}>
			{data}
		</a>
	);
}

export default ButtonPrimary;
