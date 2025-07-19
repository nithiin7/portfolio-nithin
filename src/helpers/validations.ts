import * as yup from 'yup';

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
