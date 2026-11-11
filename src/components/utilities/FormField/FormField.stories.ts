import FormField from './FormField';

const meta = {
	title: 'Utilities/FormField',
	component: FormField,
};

export default meta;

export const Input = {
	args: { name: 'name', label: 'Your name', index: '01', placeholder: 'Jane' },
};

export const Invalid = {
	args: {
		name: 'email',
		label: 'Your email',
		index: '02',
		type: 'email',
		error: 'Invalid email',
	},
};

export const Valid = {
	args: { name: 'name', label: 'Your name', index: '01', valid: true },
};

export const Multiline = {
	args: {
		name: 'message',
		label: 'Message',
		index: '03',
		multiline: true,
		maxLength: 500,
		count: 42,
	},
};
