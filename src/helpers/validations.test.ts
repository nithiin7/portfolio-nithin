import { describe, expect, it } from 'vitest';

import { commentSchema, contactSchema, emailSchema } from 'helpers/validations';

const validContact = {
	name: 'Nithin',
	email: 'nithin@example.com',
	message: 'Hello there',
};

describe('contactSchema', () => {
	it('accepts a valid submission', async () => {
		await expect(contactSchema.validate(validContact)).resolves.toEqual(
			validContact
		);
	});

	it.each([
		['missing name', { ...validContact, name: '' }, 'Name is required'],
		[
			'name too short',
			{ ...validContact, name: 'A' },
			'Name must be at least 2 characters long',
		],
		[
			'name only spaces',
			{ ...validContact, name: '   ' },
			'Name cannot contain only spaces',
		],
		[
			'invalid email',
			{ ...validContact, email: 'not-an-email' },
			'Invalid email',
		],
		[
			'missing message',
			{ ...validContact, message: '' },
			'Message is required',
		],
		[
			'message too long',
			{ ...validContact, message: 'x'.repeat(501) },
			'Message must be at most 500 characters',
		],
	])('rejects %s', async (_label, data, message) => {
		await expect(contactSchema.validate(data)).rejects.toThrow(message);
	});
});

describe('emailSchema', () => {
	it('accepts a valid email', async () => {
		await expect(emailSchema.validate({ email: 'a@b.com' })).resolves.toEqual({
			email: 'a@b.com',
		});
	});

	it('rejects an invalid email', async () => {
		await expect(emailSchema.validate({ email: 'nope' })).rejects.toThrow(
			'Please enter a valid email address'
		);
	});

	it('rejects a missing email', async () => {
		await expect(emailSchema.validate({ email: '' })).rejects.toThrow(
			'Email is required'
		);
	});
});

describe('commentSchema', () => {
	const validComment = {
		authorName: 'Nithin',
		authorEmail: 'nithin@example.com',
		content: 'This is a thoughtful comment.',
	};

	it('accepts a valid comment', async () => {
		await expect(commentSchema.validate(validComment)).resolves.toEqual(
			validComment
		);
	});

	it.each([
		[
			'content too short',
			{ ...validComment, content: 'too short' },
			'Comment must be at least 10 characters',
		],
		[
			'content too long',
			{ ...validComment, content: 'x'.repeat(1001) },
			'Comment must be less than 1000 characters',
		],
		[
			'invalid email',
			{ ...validComment, authorEmail: 'bad' },
			'Please enter a valid email address',
		],
	])('rejects %s', async (_label, data, message) => {
		await expect(commentSchema.validate(data)).rejects.toThrow(message);
	});
});
