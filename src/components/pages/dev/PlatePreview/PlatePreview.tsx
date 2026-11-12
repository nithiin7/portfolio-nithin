import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, FC } from 'react';

import {
	IMAGE_CROPS,
	PREVIEW_VIEWPORTS,
	appliesAt,
	ratioAt,
	safeZone,
	type ImageCrop,
} from 'config/imageCrops';
import type { PlateManifestEntry } from 'types/plates';

import styles from './PlatePreview.module.scss';

export interface PlateGroup {
	slug: string;
	plates: PlateManifestEntry[];
}

interface PlatePreviewProps {
	groups: PlateGroup[];
	debug: boolean;
}

const NAMED_RATIOS: [number, string][] = [
	[21 / 9, '21:9'],
	[16 / 9, '16:9'],
	[16 / 10, '16:10'],
	[4 / 3, '4:3'],
];

const ratioLabel = (ratio: number): string =>
	NAMED_RATIOS.find(([value]) => Math.abs(value - ratio) < 0.005)?.[1] ??
	`${ratio.toFixed(2)}:1`;

const cropsFor = (plate: PlateManifestEntry): ImageCrop[] =>
	plate.use.length
		? IMAGE_CROPS.filter((crop) => plate.use.includes(crop.field))
		: IMAGE_CROPS;

const PlatePreview: FC<PlatePreviewProps> = ({ groups, debug }) => {
	const safe = safeZone();

	return (
		<main className={styles.PlatePreview}>
			<header className={styles.PlatePreview__head}>
				<h1 className={styles.PlatePreview__title}>Plates</h1>
				<p className={styles.PlatePreview__meta}>
					3840×2160 master · safe {safe.width}×{safe.height} · dev only
				</p>
				<Link
					className={styles.PlatePreview__toggle}
					href={debug ? '/dev/plates' : '/dev/plates?debug=1'}
				>
					{debug ? 'Hide crop guides' : 'Show crop guides'}
				</Link>
			</header>

			{groups.length === 0 && (
				<p className={styles.PlatePreview__empty}>
					No plates yet. Run <code>pnpm plates</code>.
				</p>
			)}

			{groups.map((group) =>
				group.plates.map((plate) => {
					const src = `/dev/plates/${group.slug}/${debug ? plate.debug : plate.file}`;
					return (
						<section key={plate.file} className={styles.PlatePreview__plate}>
							<div className={styles.PlatePreview__plateHead}>
								<h2 className={styles.PlatePreview__file}>{plate.file}</h2>
								<p className={styles.PlatePreview__meta}>
									{plate.template} · {plate.surface} ·{' '}
									{plate.use.join(', ') || 'unassigned'}
								</p>
								<p className={styles.PlatePreview__alt}>{plate.alt}</p>
							</div>

							<div className={styles.PlatePreview__viewports}>
								{PREVIEW_VIEWPORTS.map((viewport) => (
									<div
										key={viewport.label}
										className={styles.PlatePreview__viewport}
									>
										<h3 className={styles.PlatePreview__meta}>
											{viewport.label}
										</h3>
										<ul className={styles.PlatePreview__crops}>
											{cropsFor(plate)
												.filter((crop) => appliesAt(crop, viewport))
												.map((crop) => {
													const ratio = ratioAt(crop, viewport);
													return (
														<li
															key={`${crop.component}-${crop.slot}-${crop.from}`}
															className={styles.PlatePreview__crop}
														>
															<div
																className={styles.PlatePreview__frame}
																style={
																	{
																		'--ratio': ratio,
																		'--zoom': crop.zoom ?? 1,
																	} as CSSProperties
																}
															>
																<Image
																	src={src}
																	alt=""
																	fill
																	unoptimized
																	sizes="33vw"
																/>
															</div>
															<p className={styles.PlatePreview__meta}>
																{crop.component} {crop.slot} ·{' '}
																{ratioLabel(ratio)}
																{crop.zoom ? ` · ×${crop.zoom}` : ''}
																{crop.decorative ? ' · decorative' : ''}
															</p>
														</li>
													);
												})}
										</ul>
									</div>
								))}
							</div>
						</section>
					);
				})
			)}
		</main>
	);
};

export default PlatePreview;
