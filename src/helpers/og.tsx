// Server-only (fetches fonts at render time); keep out of the helpers barrel.
import { ImageResponse } from 'next/og';
import type { ReactElement } from 'react';

import { siteConfig } from 'config/site';
import { loadSiteSettings } from 'helpers/contentful';
import { palette } from 'styles/tokens';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

export const OG_PAD = 64;
export const ogHairline = `${palette.paper}24`;
export const ogHost = new URL(siteConfig.url).host;

/** `axis` is the Google Fonts css2 axis spec, e.g. `wght@500` or `ital@1`. */
export async function loadGoogleFont(
	family: string,
	axis: string,
	text: string
): Promise<ArrayBuffer> {
	const css = await (
		await fetch(
			`https://fonts.googleapis.com/css2?family=${family}:${axis}&text=${encodeURIComponent(text)}`,
			{
				headers: {
					// An old UA makes Google serve TTF, which Satori can read (it can't read WOFF2)
					'User-Agent':
						'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
				},
			}
		)
	).text();
	const resource = css.match(
		/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
	);

	if (!resource) {
		throw new Error(`Failed to resolve font: ${family} ${axis}`);
	}

	return (await fetch(resource[1])).arrayBuffer();
}

export interface OgFonts {
	display: string;
	mono: string;
	serif: string;
}

export const loadOgFonts = async ({
	display,
	mono,
	serif,
}: OgFonts): Promise<
	NonNullable<ConstructorParameters<typeof ImageResponse>[1]>['fonts']
> => {
	const [displayData, monoData, serifData] = await Promise.all([
		loadGoogleFont('Inter+Tight', 'wght@500', display),
		loadGoogleFont('JetBrains+Mono', 'wght@400', mono),
		loadGoogleFont('Instrument+Serif', 'ital@1', serif),
	]);
	return [
		{ name: 'Inter Tight', data: displayData, weight: 500 },
		{ name: 'JetBrains Mono', data: monoData, weight: 400 },
		{ name: 'Instrument Serif', data: serifData, style: 'italic' },
	];
};

export const titleSizeFor = (title: string): number => {
	if (title.length > 60) return 60;
	if (title.length > 40) return 72;
	if (title.length > 24) return 88;
	return 120;
};

const Rule = ({
	position,
	children,
}: {
	position: 'top' | 'bottom';
	children: ReactElement[];
}): ReactElement => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			...(position === 'top'
				? { paddingBottom: 18, borderBottom: `1px solid ${ogHairline}` }
				: {
						marginTop: 'auto',
						paddingTop: 18,
						borderTop: `1px solid ${ogHairline}`,
					}),
			fontSize: 20,
			letterSpacing: 0.4,
			color: palette.grey500,
		}}
	>
		{children}
	</div>
);

export const OgDot = (): ReactElement => (
	<div
		style={{
			width: 10,
			height: 10,
			borderRadius: 999,
			backgroundColor: palette.orange,
		}}
	/>
);

export interface OgCardProps {
	/** Top-left mono label (the site owner's name). */
	author: string;
	/** Top-right mono label, e.g. a section number or `/blog`. */
	kicker: string;
	/** Serif italic line above the title. */
	eyebrow: string;
	title: string;
	/** Bottom-left mono line. */
	meta?: string;
}

/** The text-only editorial card shared by every route's opengraph-image. */
export const OgCard = ({
	author,
	kicker,
	eyebrow,
	title,
	meta = '',
}: OgCardProps): ReactElement => {
	const size = titleSizeFor(title);
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				padding: OG_PAD,
				backgroundColor: palette.ink,
				color: palette.paper,
				fontFamily: 'JetBrains Mono',
			}}
		>
			<Rule position="top">
				<div style={{ display: 'flex' }}>{author.toUpperCase()}</div>
				<div style={{ display: 'flex', color: palette.paper }}>{kicker}</div>
			</Rule>

			<div
				style={{
					display: 'flex',
					marginTop: 48,
					fontFamily: 'Instrument Serif',
					fontStyle: 'italic',
					fontSize: 44,
					color: palette.orange,
				}}
			>
				{eyebrow}
			</div>

			<div
				style={{
					display: 'flex',
					marginTop: 8,
					maxWidth: 1000,
					fontFamily: 'Inter Tight',
					fontWeight: 500,
					fontSize: size,
					lineHeight: 0.98,
					letterSpacing: -size * 0.035,
				}}
			>
				{title}
			</div>

			<Rule position="bottom">
				<div style={{ display: 'flex' }}>{meta}</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						flexShrink: 0,
						whiteSpace: 'nowrap',
					}}
				>
					<OgDot />
					{ogHost}
				</div>
			</Rule>
		</div>
	);
};

/** Renders an OgCard with exactly the glyphs it needs subset from Google Fonts. */
export const renderOgCard = async (
	props: Omit<OgCardProps, 'author'>
): Promise<ImageResponse> => {
	const { name: author } = await loadSiteSettings();
	const fonts = await loadOgFonts({
		display: props.title,
		mono: `${author.toUpperCase()}${props.kicker}${props.meta ?? ''}${ogHost}`,
		serif: props.eyebrow,
	});
	return new ImageResponse(<OgCard {...props} author={author} />, {
		...ogSize,
		fonts,
	});
};
