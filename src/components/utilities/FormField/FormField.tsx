import type {
	ChangeEventHandler,
	FocusEventHandler,
	HTMLInputAutoCompleteAttribute,
	ReactElement,
} from 'react';

import styles from './FormField.module.scss';

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface FormFieldProps {
	name: string;
	id?: string;
	label: string;
	index?: string;
	type?: 'text' | 'email';
	multiline?: boolean;
	rows?: number;
	placeholder?: string;
	autoComplete?: HTMLInputAutoCompleteAttribute;
	inputMode?: 'text' | 'email';
	maxLength?: number;
	count?: number;
	error?: string;
	valid?: boolean;
	disabled?: boolean;
	className?: string;
	onChange?: ChangeEventHandler<FieldElement>;
	onBlur?: FocusEventHandler<FieldElement>;
	ref?: (node: FieldElement | null) => void;
}

/** Labelled input or textarea wired to React Hook Form. */
const FormField = ({
	name,
	id: idProp,
	label,
	index,
	type = 'text',
	multiline = false,
	rows = 5,
	placeholder,
	autoComplete,
	inputMode,
	maxLength,
	count,
	error,
	valid = false,
	disabled = false,
	className,
	onChange,
	onBlur,
	ref,
}: FormFieldProps): ReactElement => {
	const id = idProp ?? `field-${name}`;
	const errorId = `${id}-error`;
	const counterId = `${id}-count`;
	const showCounter = maxLength !== undefined && count !== undefined;
	const describedBy =
		[error ? errorId : null, showCounter ? counterId : null]
			.filter(Boolean)
			.join(' ') || undefined;

	const shared = {
		id,
		name,
		placeholder,
		maxLength,
		disabled,
		onChange,
		onBlur,
		ref,
		className: styles.FormField__control,
		'aria-required': true,
		'aria-invalid': Boolean(error),
		'aria-describedby': describedBy,
	};

	return (
		<div
			className={[styles.FormField, className].filter(Boolean).join(' ')}
			data-state={error ? 'error' : valid ? 'valid' : undefined}
		>
			<div className={styles.FormField__head}>
				<label htmlFor={id} className={styles.FormField__label}>
					{index && (
						<span className={styles.FormField__index} aria-hidden="true">
							{index}
						</span>
					)}
					{label}
				</label>
				<span className={styles.FormField__status} aria-hidden="true">
					{valid && !error ? '✓' : null}
				</span>
			</div>

			<div className={styles.FormField__frame}>
				{multiline ? (
					<textarea {...shared} rows={rows} />
				) : (
					<input
						{...shared}
						type={type}
						autoComplete={autoComplete}
						inputMode={inputMode}
					/>
				)}
			</div>

			<div className={styles.FormField__foot}>
				<p id={errorId} className={styles.FormField__error} aria-live="polite">
					{error}
				</p>
				{showCounter && (
					<p id={counterId} className={styles.FormField__count}>
						{count}/{maxLength}
						<span className={styles.FormField__srOnly}> characters</span>
					</p>
				)}
			</div>
		</div>
	);
};

export default FormField;
