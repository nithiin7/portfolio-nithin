import Image, { type ImageProps } from 'next/image';
import type { FC } from 'react';

import styles from './ThemedImage.module.scss';

export interface ThemedImageProps extends Omit<
	ImageProps,
	'src' | 'blurDataURL' | 'placeholder'
> {
	src: string;
	srcDark?: string;
	blurDataURL?: string;
	blurDataURLDark?: string;
}

const placeholder = (blur?: string) =>
	({
		placeholder: blur ? 'blur' : 'empty',
		blurDataURL: blur,
	}) as const;

/** Image that swaps to its dark source in the dark theme. */
const ThemedImage: FC<ThemedImageProps> = ({
	src,
	srcDark,
	blurDataURL,
	blurDataURLDark,
	className,
	priority,
	preload,
	fetchPriority,
	loading,
	...rest
}) => {
	if (!srcDark) {
		return (
			<Image
				{...rest}
				{...placeholder(blurDataURL)}
				src={src}
				className={className}
				priority={priority}
				preload={preload}
				fetchPriority={fetchPriority}
				loading={loading}
			/>
		);
	}

	const join = (variant: string | undefined) =>
		[className, variant].filter(Boolean).join(' ');

	return (
		<>
			<Image
				{...rest}
				{...placeholder(blurDataURLDark)}
				src={srcDark}
				className={join(styles.ThemedImage__dark)}
				priority={priority}
				preload={preload}
				fetchPriority={fetchPriority}
				loading={loading}
			/>
			<Image
				{...rest}
				{...placeholder(blurDataURL)}
				src={src}
				className={join(styles.ThemedImage__light)}
				loading="lazy"
			/>
		</>
	);
};

export default ThemedImage;
