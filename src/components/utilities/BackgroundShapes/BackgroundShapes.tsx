import type { FC } from 'react';

export interface BackgroundShapeProps {
	className?: string;
	viewBox: string;
	fill: string;
	width?: number;
	height?: number;
	transform?: string;
	children?: React.ReactNode;
}

export interface BackgroundShapesProps {
	left?: Partial<BackgroundShapeProps>;
	right?: Partial<BackgroundShapeProps>;
}

const BackgroundShape: FC<BackgroundShapeProps> = ({
	className,
	viewBox,
	fill,
	width,
	height,
	transform,
	children,
}) => (
	<svg
		className={className}
		viewBox={viewBox}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		{children || (
			<rect
				width={width}
				height={height}
				rx="169.963"
				fill={fill}
				transform={transform}
			/>
		)}
	</svg>
);

const BackgroundShapes: FC<BackgroundShapesProps> = ({ left, right }) => (
	<>
		{left && (
			<BackgroundShape
				className={left.className}
				viewBox={left.viewBox || '0 0 709 300'}
				fill={left.fill || '#AFAF9D'}
				width={left.width || 709}
				height={left.height || 300}
				transform={left.transform}
			/>
		)}
		{right && (
			<BackgroundShape
				className={right.className}
				viewBox={right.viewBox || '0 0 594 209'}
				fill={right.fill || '#E8E8E3'}
				width={right.width || 594}
				height={right.height || 209}
				transform={right.transform || 'rotate(-180 594 209)'}
			>
				<rect
					x="594"
					y="209"
					width={right.width || 594}
					height={right.height || 209}
					rx="126.5"
					transform={right.transform || 'rotate(-180 594 209)'}
					fill={right.fill || '#E8E8E3'}
				/>
			</BackgroundShape>
		)}
	</>
);

export default BackgroundShapes;
