import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
	createRateLimiter,
	isRecaptchaConfigured,
	verifyRecaptcha,
} from 'helpers/apiProtection';

const isRateLimited = createRateLimiter({
	max: 10,
	windowMs: 10 * 60 * 1000,
});

// Keep this profile in sync with the resume and Contentful content — it is
// the only knowledge the palette AI has about Nithin.
const PROFILE = `
Nithin Pradeep is a Full Stack Developer based in India, currently working at
Paytm Payments Bank. He specializes in React, Next.js, TypeScript, Node.js and
modern frontend engineering — animation-heavy interfaces (Motion/Framer Motion,
GSAP), GraphQL (Apollo, Contentful), Supabase/Postgres, SCSS, and component
systems documented in Storybook. This portfolio site itself is built with
Next.js App Router, React Server Components, Contentful and Supabase.

Links:
- GitHub: https://github.com/nithiin7
- LinkedIn: https://www.linkedin.com/in/nithin-p7/
- Email: nithinp150@gmail.com
- Resume: available for download on this site (/resume.pdf)
- Contact page: /contact
`;

const SYSTEM_PROMPT = `You are the AI assistant on Nithin Pradeep's portfolio
website, answering questions from visitors and recruiters. Answer in the third
person ("Nithin has..."). Be concise — under 100 words, no markdown. Only use
the facts below; if you don't know something, say so and point the visitor to
the contact page or the resume download. Never invent employers, dates or
projects.

${PROFILE}`;

export async function POST(request: NextRequest) {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		return NextResponse.json(
			{ error: 'AI is not configured yet — try the chat bubble instead.' },
			{ status: 503 }
		);
	}

	if (isRateLimited(request)) {
		return NextResponse.json(
			{ error: 'Too many questions — please try again in a few minutes.' },
			{ status: 429 }
		);
	}

	try {
		const body = await request.json();
		const question =
			typeof body.question === 'string' ? body.question.trim() : '';

		if (!question) {
			return NextResponse.json(
				{ error: 'Question is required' },
				{ status: 400 }
			);
		}

		if (question.length > 500) {
			return NextResponse.json(
				{ error: 'Question is too long (max 500 characters)' },
				{ status: 400 }
			);
		}

		// Skipped only when no RECAPTCHA_SECRET_KEY is configured (local dev).
		if (isRecaptchaConfigured()) {
			const token =
				typeof body.recaptchaToken === 'string' ? body.recaptchaToken : '';
			const recaptcha = token
				? await verifyRecaptcha(token)
				: { valid: false, score: 0 };

			if (!recaptcha.valid) {
				return NextResponse.json(
					{ error: 'Verification failed — please try again.' },
					{ status: 400 }
				);
			}
		}

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: SYSTEM_PROMPT },
					{ role: 'user', content: question },
				],
				max_tokens: 300,
				temperature: 0.5,
			}),
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.error('OpenAI error:', response.status, errorBody);
			return NextResponse.json(
				{ error: 'The AI is unavailable right now. Please try again.' },
				{ status: 502 }
			);
		}

		const data = await response.json();
		const answer = data.choices?.[0]?.message?.content?.trim();

		if (!answer) {
			return NextResponse.json(
				{ error: 'The AI returned an empty answer. Please try again.' },
				{ status: 502 }
			);
		}

		return NextResponse.json({ answer });
	} catch (error) {
		console.error('Error in POST /api/ask:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
