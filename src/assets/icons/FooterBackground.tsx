import type { ReactElement } from 'react';

interface FooterBackgroundProps {
	className?: string;
}

/**
 * Footer background gradient circle SVG component.
 *
 * @component
 * @param {FooterBackgroundProps} props - Component props
 * @returns {JSX.Element} The rendered FooterBackground component.
 */
const FooterBackground = ({
	className,
}: FooterBackgroundProps): ReactElement => {
	return (
		<svg
			width="1186"
			height="1186"
			viewBox="0 0 1186 1186"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<circle
				cx="593"
				cy="593"
				r="593"
				fill="url(#paint0_linear_4949_267)"
			></circle>
			<defs>
				<linearGradient
					id="paint0_linear_4949_267"
					x1="593"
					y1="0"
					x2="593"
					y2="1186"
					gradientUnits="userSpaceOnUse"
				>
					<stop style={{ stopColor: 'var(--color-grey-verylight)' }}></stop>
					<stop
						offset="1"
						style={{ stopColor: 'var(--color-grey-verylight)' }}
						stopOpacity="0"
					></stop>
				</linearGradient>
			</defs>
		</svg>
	);
};

export default FooterBackground;
