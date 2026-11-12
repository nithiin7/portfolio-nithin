import { ImageResponse } from 'next/og';

import { siteConfig } from 'config/site';
import { positionOf } from 'helpers/caseStudy';
import { loadPortfolioData, loadWorksOrder } from 'helpers/contentful';
import {
	OG_PAD as PAD,
	OgDot,
	loadGoogleFont,
	ogContentType,
	ogHairline as hairline,
	ogHost as host,
	ogSize,
} from 'helpers/og';
import { palette } from 'styles/tokens';

export const alt = `Case study — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

const COVER_WIDTH = 400;

const pad = (n: number): string => String(n).padStart(2, '0');

export default async function Image({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<ImageResponse> {
	const { id } = await params;
	const [{ data }, order] = await Promise.all([
		loadPortfolioData(id),
		loadWorksOrder(),
	]);
	const project = data?.portfolioDetailsCollection?.items?.[0];

	const title = project?.title ?? 'Selected works';
	const year = project?.year ?? '';
	// Keep the footer row on one line next to the host name
	const tech = (project?.tech ?? [])
		.slice(0, 3)
		.reduce<string[]>(
			(kept, item) =>
				[...kept, item].join(' · ').length <= 22 ? [...kept, item] : kept,
			[]
		);
	const cover = project?.spotlightImage?.url;
	const position = project ? positionOf(order, project.id) : null;

	const kicker = position
		? `${pad(position.position)}/${pad(position.total)}`
		: '';
	const titleSize = title.length > 40 ? 64 : title.length > 24 ? 80 : 96;
	const monoText = `${siteConfig.name.toUpperCase()}${kicker}${year}${tech.join(' · ')}${host}—`;

	const [display, mono, serif] = await Promise.all([
		loadGoogleFont('Inter+Tight', 'wght@500', title),
		loadGoogleFont('JetBrains+Mono', 'wght@400', monoText),
		loadGoogleFont('Instrument+Serif', 'ital@1', 'Case study'),
	]);

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				backgroundColor: palette.ink,
				color: palette.paper,
				fontFamily: 'JetBrains Mono',
			}}
		>
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					padding: PAD,
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						paddingBottom: 18,
						borderBottom: `1px solid ${hairline}`,
						fontSize: 20,
						letterSpacing: 0.4,
						color: palette.grey500,
					}}
				>
					<div style={{ display: 'flex' }}>{siteConfig.name.toUpperCase()}</div>
					<div style={{ display: 'flex', color: palette.paper }}>{kicker}</div>
				</div>

				<div
					style={{
						display: 'flex',
						marginTop: 40,
						fontFamily: 'Instrument Serif',
						fontStyle: 'italic',
						fontSize: 40,
						color: palette.orange,
					}}
				>
					Case study
				</div>

				<div
					style={{
						display: 'flex',
						marginTop: 8,
						fontFamily: 'Inter Tight',
						fontWeight: 500,
						fontSize: titleSize,
						lineHeight: 0.98,
						letterSpacing: -titleSize * 0.035,
					}}
				>
					{title}
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: 'auto',
						paddingTop: 18,
						borderTop: `1px solid ${hairline}`,
						fontSize: 18,
						letterSpacing: 0.4,
						color: palette.grey500,
					}}
				>
					<div style={{ display: 'flex' }}>
						{[year, tech.join(' · ')].filter(Boolean).join(' — ')}
					</div>
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
						{host}
					</div>
				</div>
			</div>

			{cover && (
				<div
					style={{
						display: 'flex',
						width: COVER_WIDTH,
						height: '100%',
						borderLeft: `1px solid ${hairline}`,
					}}
				>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<img
						src={`${cover.startsWith('//') ? 'https:' : ''}${cover}?w=${COVER_WIDTH * 2}&h=${size.height * 2}&fit=fill&fm=jpg&q=80`}
						width={COVER_WIDTH}
						height={size.height}
						style={{ objectFit: 'cover' }}
					/>
				</div>
			)}
		</div>,
		{
			...size,
			fonts: [
				{ name: 'Inter Tight', data: display, weight: 500 },
				{ name: 'JetBrains Mono', data: mono, weight: 400 },
				{ name: 'Instrument Serif', data: serif, style: 'italic' },
			],
		}
	);
}
