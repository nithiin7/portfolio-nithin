import * as yup from 'yup';

/**
 * Contact form validation schema
 */
export const contactSchema = yup
	.object({
		name: yup
			.string()
			.required('Name is required')
			.min(2, 'Name must be at least 2 characters long')
			.max(50, 'Name must be at most 50 characters')
			.test('no-only-spaces', 'Name cannot contain only spaces', (value) => {
				return value.trim() !== '';
			}),
		email: yup.string().email('Invalid email').required('Email is required'),
		message: yup
			.string()
			.required('Message is required')
			.min(2, 'Message must be at least 2 characters long')
			.max(500, 'Message must be at most 500 characters')
			.test('no-only-spaces', 'Message cannot contain only spaces', (value) => {
				return value.trim() !== '';
			}),
	})
	.required();

/**
 * Email form validation schema
 */
export const emailSchema = yup
	.object({
		email: yup
			.string()
			.email('Please enter a valid email address')
			.required('Email is required'),
	})
	.required();

/**
 * Comment form validation schema
 */
export const commentSchema = yup.object({
	authorName: yup
		.string()
		.required('Name is required')
		.min(2, 'Name must be at least 2 characters')
		.max(50, 'Name must be less than 50 characters'),
	authorEmail: yup
		.string()
		.required('Email is required')
		.email('Please enter a valid email address'),
	content: yup
		.string()
		.required('Comment is required')
		.min(10, 'Comment must be at least 10 characters')
		.max(1000, 'Comment must be less than 1000 characters'),
});
