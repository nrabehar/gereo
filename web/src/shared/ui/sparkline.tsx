import { cn } from '$/cn'

type SparklineProps = {
	data: number[]
	width?: number
	height?: number
	area?: boolean
	className?: string
}

export const Sparkline = ({
	data,
	width = 96,
	height = 32,
	area = true,
	className,
}: SparklineProps) => {
	if (data.length < 2) {
		return null
	}

	const min = Math.min(...data)
	const max = Math.max(...data)
	const span = max - min || 1
	const pad = 5
	const step = (width - pad * 2) / (data.length - 1)
	const points = data.map((value, index) => ({
		x: pad + index * step,
		y: pad + (1 - (value - min) / span) * (height - pad * 2),
	}))
	const line = points
		.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
		.join(' ')
	const last = points[points.length - 1]

	if (!last) {
		return null
	}

	return (
		<svg
			aria-hidden="true"
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			className={cn('text-series-1 max-w-full shrink-0', className)}
		>
			{area && (
				<path
					d={`${line} L${last.x},${height - pad} L${pad},${height - pad} Z`}
					fill="currentColor"
					opacity={0.1}
				/>
			)}
			<path
				d={line}
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx={last.x}
				cy={last.y}
				r={4}
				fill="currentColor"
				className="stroke-card"
				strokeWidth={2}
			/>
		</svg>
	)
}
