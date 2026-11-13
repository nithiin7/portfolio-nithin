import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createChatCompletion, createEmbeddings } from 'clients/openai';
import embeddingsData from 'data/embeddings.json';
import {
	createRateLimiter,
	isRecaptchaConfigured,
	jsonError,
	tooManyRequests,
	verifyRecaptcha,
} from 'helpers/apiProtection';
import { serverEnv } from 'helpers/env';
import { findRelevantChunks, type EmbeddingsFile } from 'helpers/rag';

const isRateLimited = createRateLimiter({
	max: 10,
	windowMs: 10 * 60 * 1000,
});

const PROFILE = `
Nithin P — Software Engineer, Kochi, Kerala, India. 4 years experience.

EXPERIENCE:
- Paytm Payments Bank, Software Engineer, Noida (Jul'25-present): built
  on-prem MCP servers for Jira/Confluence/file servers (OAuth+PAT, proxied,
  no external network exposure); RAG pipeline (Python+ChromaDB) over
  circulars/notices/Excel/Word for 6 teams; Text-to-Query AI agent
  (LangGraph + self-hosted LLM); led org-wide AI access policy.
- White Rabbit Group, Senior Software Engineer, Kochi (Feb'25-Jul'25):
  migrated Spotify and Game Awards sites (1M+ concurrent users) to Next.js
  SSR + CDN, 50% faster loads, 10% infra cost cut.
- White Rabbit Group, Software Engineer, Kochi (Jul'22-Feb'25): built UIs
  and Node.js/PHP backends; mentored as Squad Champ across 15+ client
  projects; led company site revamp to Next.js + Contentful CMS (+50% perf).

SKILLS: JavaScript, TypeScript, Python, PHP, React, Next.js, Node.js,
Laravel, .NET; AWS, Docker, GCP; LangGraph, LangChain, n8n, MCP, Agentic AI,
LLMs. Also: Motion/Framer Motion, GSAP, GraphQL/Apollo, Contentful,
Supabase/Postgres, SCSS, Storybook. This portfolio itself is built with
Next.js App Router, RSC, Contentful and Supabase.

EDUCATION: B-Tech Computer Science, SCMS School of Engineering and
Technology, GPA 8.88 (Jul'22).

CERTIFICATIONS: IBM AI Developer (Dec'25), Meta Front-End Developer (Nov'25).

LINKS:
- GitHub: https://github.com/nithiin7
- LinkedIn: https://www.linkedin.com/in/nithin-p7/
- Email: nithinp150@gmail.com
- Resume: /resume.pdf
- Contact page: /contact
`;

const SYSTEM_PROMPT = `You are the AI assistant on Nithin Pradeep's portfolio
website, answering questions from visitors and recruiters. Answer in the third
person ("Nithin has..."). Be concise — under 100 words, no markdown. Only use
the facts below and the retrieved context, if any; if you don't know something,
say so and point the visitor to the contact page or the resume download. Never
invent employers, dates or projects.

${PROFILE}`;

const embeddings = embeddingsData as EmbeddingsFile;

const buildSystemPrompt = async (
	question: string,
	apiKey: string
): Promise<string> => {
	if (embeddings.chunks.length === 0) return SYSTEM_PROMPT;

	const [queryVector] = await createEmbeddings([question], apiKey);
	if (!queryVector) return SYSTEM_PROMPT;
	const relevant = findRelevantChunks(queryVector, embeddings.chunks);

	if (relevant.length === 0) return SYSTEM_PROMPT;

	const context = relevant.map((chunk) => chunk.text).join('\n\n---\n\n');

	return `${SYSTEM_PROMPT}\n\nRETRIEVED CONTEXT (relevant to this question):\n\n${context}`;
};

export async function POST(request: NextRequest) {
	const apiKey = serverEnv.OPENAI_API_KEY;

	if (!apiKey) {
		return jsonError(
			503,
			'AI is not configured yet — try the chat bubble instead.'
		);
	}

	if (isRateLimited(request.headers)) {
		return tooManyRequests(
			'Too many questions — please try again in a few minutes.'
		);
	}

	try {
		const body = await request.json();
		const question =
			typeof body.question === 'string' ? body.question.trim() : '';

		if (!question) {
			return jsonError(400, 'Question is required');
		}

		if (question.length > 500) {
			return jsonError(400, 'Question is too long (max 500 characters)');
		}

		// Skipped only when no RECAPTCHA_SECRET_KEY is configured (local dev).
		if (isRecaptchaConfigured()) {
			const token =
				typeof body.recaptchaToken === 'string' ? body.recaptchaToken : '';
			const recaptcha = token
				? await verifyRecaptcha(token)
				: { valid: false, score: 0 };

			if (!recaptcha.valid) {
				return jsonError(400, 'Verification failed — please try again.');
			}
		}

		let answer: string | undefined;
		try {
			const systemPrompt = await buildSystemPrompt(question, apiKey);
			answer = await createChatCompletion(
				[
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: question },
				],
				apiKey
			);
		} catch (error) {
			console.error('OpenAI error:', error);
			return jsonError(
				502,
				'The AI is unavailable right now. Please try again.'
			);
		}

		if (!answer) {
			return jsonError(
				502,
				'The AI returned an empty answer. Please try again.'
			);
		}

		return NextResponse.json({ answer });
	} catch (error) {
		console.error('Error in POST /api/ask:', error);
		return jsonError(500, 'Internal server error');
	}
}
