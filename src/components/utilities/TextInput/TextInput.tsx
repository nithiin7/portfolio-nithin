import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { forwardRef } from 'react';

import styles from './TextInput.module.scss';

interface TextInputProps {
	name?: string;
	className?: string;
	type?: string;
	placeholder?: string;
	value?: string;
	label?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onBlur?: FocusEventHandler<HTMLInputElement>;
	disabled?: boolean;
	errors?: string[];
}

/**
 * TextInput component that allows users to input text.
 *
 * @param {TextInputProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered TextInput component.
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			name = '',
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
			<div className={`${styles.TextInput} ${className}`}>
				{label && (
					<div className={styles.TextInput__label}>
						<label htmlFor={name}>{label}</label>
						<span>*</span>
					</div>
				)}
				<input
					className={styles.TextInput__input}
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
				<div className={styles.TextInput__errors}>
					{errors.length > 0 && (
						<div className={styles.TextInput__formErrors}>
							{errors.map((error, index) => (
								<p key={`${error}-${index}`}>{error}</p>
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
