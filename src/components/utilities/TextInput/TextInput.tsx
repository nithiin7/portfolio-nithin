import React from 'react';
import styles from './TextInput.module.scss';

interface TextInputProps {
	name?: string;
	variant?: 'default' | 'alternative';
	className?: string;
	type?: string;
	placeholder?: string;
	value?: string;
	label?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	disabled?: boolean;
	errors?: string[] | undefined;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			name = '',
			variant = 'default',
			className = '',
			type = 'text',
			placeholder = '',
			value = '',
			label = '',
			onChange = () => {},
			onBlur = () => {},
			disabled = false,
			errors = [],
		},
		ref
	) => {
		return (
			<div
				className={`${styles.TextInput} ${
					styles[`TextInput__${variant}`]
				} ${className}`}
			>
				{label && (
					<div className="TextInput__label">
						<label htmlFor={name}>{label}</label>
						<span>*</span>
					</div>
				)}
				<input
					className="TextInput__input"
					id={name}
					name={name}
					value={value}
					type={type}
					ref={ref}
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeholder}
					aria-label={value}
					disabled={disabled}
				/>
				<div className="TextInput__errors">
					{errors.length > 0 && (
						<div className="TextInput__form-errors">
							{errors.map((error, index) => (
								<p key={index}>{error}</p>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
);

TextInput.displayName = 'TextInput';

export default TextInput;
