import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { forwardRef } from 'react';

import styles from './TextArea.module.scss';

interface TextAreaProps {
	name?: string;
	className?: string;
	placeholder?: string;
	value?: string;
	label?: string;
	rows?: number;
	onChange?: ChangeEventHandler<HTMLTextAreaElement>;
	onBlur?: FocusEventHandler<HTMLTextAreaElement>;
	disabled?: boolean;
	errors?: string[];
}

/**
 * TextArea component that allows users to input multi-line text.
 *
 * @param {TextAreaProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered TextArea component.
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	(
		{
			name = '',
			className = '',
			placeholder = '',
			value = '',
			label = '',
			rows = 7,
			onChange = () => {},
			onBlur = () => {},
			disabled = false,
			errors = [],
		},
		ref
	) => {
		return (
			<div className={`${styles.TextArea} ${className}`}>
				{label && (
					<div className={styles.TextArea__label}>
						<label htmlFor={name}>{label}</label>
						<span>*</span>
					</div>
				)}
				<textarea
					className={styles.TextArea__input}
					id={name}
					name={name}
					value={value}
					rows={rows}
					ref={ref}
					onChange={onChange}
					onBlur={onBlur}
					placeholder={placeholder}
					aria-label={label || placeholder}
					aria-describedby={errors.length > 0 ? `${name}-errors` : undefined}
					aria-invalid={errors.length > 0}
					disabled={disabled}
					required={label.includes('*')}
				/>
				<div className={styles.TextArea__errors}>
					{errors.length > 0 && (
						<div
							className={styles.TextArea__formErrors}
							id={`${name}-errors`}
							role="alert"
							aria-live="polite"
						>
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

TextArea.displayName = 'TextArea';

export default TextArea;
