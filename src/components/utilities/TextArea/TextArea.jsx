import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextArea.module.scss';

const TextArea = React.forwardRef((props, ref) => {
	const {
		name,
		variant,
		className,
		placeholder,
		value,
		label,
		rows,
		onChange,
		onBlur,
		disabled,
		errors,
	} = props;

	return (
		<div
			className={`${styles.TextArea} ${
				styles[`TextArea__${variant}`]
			} ${className}`}
		>
			{label ? (
				<div className="TextArea__label">
					<label>{label}</label>
					<span>*</span>
				</div>
			) : (
				''
			)}
			<textarea
				className="TextArea__input"
				id={name}
				name={name}
				value={value}
				rows={rows}
				ref={ref}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				aria-label={value}
				disabled={disabled}
			/>
			<div className="TextArea__errors">
				{errors && errors.length > 0 && (
					<div className={'TextArea__form-errors'}>
						{errors.map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</div>
		</div>
	);
});

TextArea.displayName = 'TextArea';

TextArea.defaultProps = {
	className: '',
	name: '',
	value: '',
	label: '',
	rows: 7,
	errors: [],
	onChange: () => {},
	onBlur: () => {},
	variant: 'default',
	placeholder: '',
	disabled: false,
};

TextArea.propTypes = {
	name: PropTypes.string,
	value: PropTypes.string,
	variant: PropTypes.string,
	className: PropTypes.string,
	rows: PropTypes.number,
	label: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	placeholder: PropTypes.string,
	errors: PropTypes.array,
	disabled: PropTypes.bool,
};

export default TextArea;
