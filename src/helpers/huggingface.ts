import { HUGGINGFACE_SPACE_ID } from 'constants/index';
import { fetchJson } from 'helpers/http';
import type { HuggingFaceStats } from 'types/huggingface';

interface HuggingFaceSpace {
	likes: number;
	runtime?: { stage: string };
}

export const loadHuggingFaceStats =
	async (): Promise<HuggingFaceStats | null> => {
		// Private spaces 401 without a token; the card is hidden in that case.
		const token = process.env.HUGGINGFACE_TOKEN;

		const space = await fetchJson<HuggingFaceSpace>(
			`https://huggingface.co/api/spaces/${HUGGINGFACE_SPACE_ID}`,
			{
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				next: { revalidate: 3600 },
			}
		);

		if (typeof space?.likes !== 'number') return null;

		return {
			likes: space.likes,
			stage: space.runtime?.stage ?? 'UNKNOWN',
			url: `https://huggingface.co/spaces/${HUGGINGFACE_SPACE_ID}`,
		};
	};
