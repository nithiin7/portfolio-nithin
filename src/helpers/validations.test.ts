import { describe, expect, it } from 'vitest';

import {
	commentRequestSchema,
	commentSchema,
	contactSchema,
	emailSchema,
	viewRequestSchema,
} from 'helpers/validations';

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

describe('commentRequestSchema', () => {
	const valid = {
		postId: 'post-1',
		authorName: 'Ada',
		authorEmail: 'ada@example.com',
		content: 'A thoughtful comment.',
		recaptchaToken: 'token',
	};

	it('accepts a complete body', async () => {
		await expect(commentRequestSchema.isValid(valid)).resolves.toBe(true);
	});

	it('rejects a missing reCAPTCHA token with the client-facing message', async () => {
		await expect(
			commentRequestSchema.validate({ ...valid, recaptchaToken: undefined })
		).rejects.toThrow('reCAPTCHA verification failed');
	});

	it('rejects oversized names', async () => {
		await expect(
			commentRequestSchema.isValid({ ...valid, authorName: 'x'.repeat(51) })
		).resolves.toBe(false);
	});
});

describe('viewRequestSchema', () => {
	it('accepts kebab-case slugs only', async () => {
		await expect(
			viewRequestSchema.isValid({ slug: 'what-is-mcp' })
		).resolves.toBe(true);
		await expect(viewRequestSchema.isValid({ slug: 'Bad Slug' })).resolves.toBe(
			false
		);
		await expect(viewRequestSchema.isValid({ slug: '../etc' })).resolves.toBe(
			false
		);
	});
});
