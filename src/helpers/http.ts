/**
 * Fetch JSON from a third-party API, returning null on any network error or
 * non-2xx response — the contract the stats loaders rely on to hide their
 * card instead of failing the page.
 */
export const fetchJson = async <T>(
	url: string,
	init?: RequestInit
): Promise<T | null> => {
	try {
		const response = await fetch(url, init);
		if (!response.ok) return null;

		return (await response.json()) as T;
	} catch {
		return null;
	}
};
