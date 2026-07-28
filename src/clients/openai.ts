const OPENAI_API_URL = 'https://api.openai.com/v1';

export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const CHAT_MODEL = 'gpt-4o-mini';

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

interface EmbeddingResponse {
	data: { embedding: number[]; index: number }[];
}

interface ChatCompletionResponse {
	choices?: { message?: { content?: string } }[];
}

const openaiRequest = async <T>(
	path: string,
	apiKey: string,
	body: object
): Promise<T> => {
	const response = await fetch(`${OPENAI_API_URL}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(
			`OpenAI ${path} request failed: ${response.status} ${await response.text()}`
		);
	}

	return response.json() as Promise<T>;
};

export const createEmbeddings = async (
	texts: string[],
	apiKey: string
): Promise<number[][]> => {
	const data = await openaiRequest<EmbeddingResponse>('/embeddings', apiKey, {
		model: EMBEDDING_MODEL,
		input: texts,
	});

	return data.data
		.sort((a, b) => a.index - b.index)
		.map((item) => item.embedding);
};

export const createChatCompletion = async (
	messages: ChatMessage[],
	apiKey: string
): Promise<string | undefined> => {
	const data = await openaiRequest<ChatCompletionResponse>(
		'/chat/completions',
		apiKey,
		{
			model: CHAT_MODEL,
			messages,
			max_tokens: 300,
			temperature: 0.5,
		}
	);

	return data.choices?.[0]?.message?.content?.trim();
};
