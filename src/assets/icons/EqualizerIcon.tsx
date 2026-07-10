import type { ReactElement } from 'react';

interface EqualizerIconProps {
	className?: string;
}

/**
 * Animated equalizer bars SVG, used as a "now playing" indicator.
 *
 * @component
 * @param {EqualizerIconProps} props - Component props
 * @returns {JSX.Element} The rendered EqualizerIcon component.
 */
const EqualizerIcon = ({ className }: EqualizerIconProps): ReactElement => {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<rect x="1" y="6" width="3" height="8" rx="1" fill="currentColor" />
			<rect x="6.5" y="2" width="3" height="12" rx="1" fill="currentColor" />
			<rect x="12" y="8" width="3" height="6" rx="1" fill="currentColor" />
		</svg>
	);
};

export default EqualizerIcon;
