import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

import { cn } from '$/cn'

type BarChartSeries = {
	id: string
	label: string
	data: number[]
}

type BarChartProps = {
	labels: string[]
	series: BarChartSeries[]
	caption: string
	height?: number
	formatValue?: (value: number) => string
	locale?: string
	className?: string
}

const MARGIN = { top: 12, right: 16, bottom: 28, left: 48 }
const MAX_BAR = 24
const GAP = 2
const RADIUS = 4

const NICE_STEPS = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]

const niceMax = (max: number) => {
	if (max <= 0) {
		return 1
	}

	const exponent = Math.floor(Math.log10(max))
	const base = 10 ** exponent
	const fraction = max / base
	const step = NICE_STEPS.find((candidate) => fraction <= candidate) ?? 10

	return step * base
}

const barPath = (x: number, y: number, width: number, height: number, rounded: boolean) => {
	const r = rounded ? Math.min(RADIUS, width / 2, height) : 0

	return `M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`
}

export const BarChart = ({
	labels,
	series,
	caption,
	height = 240,
	formatValue,
	locale = 'fr-FR',
	className,
}: BarChartProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [width, setWidth] = useState(0)
	const [active, setActive] = useState<number | null>(null)

	useEffect(() => {
		const element = containerRef.current

		if (!element) {
			return undefined
		}

		const observer = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 0))
		observer.observe(element)

		return () => observer.disconnect()
	}, [])

	const compact = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 })
	const full = new Intl.NumberFormat(locale)
	const format = formatValue ?? ((value: number) => full.format(value))

	const count = labels.length
	const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
	const plotHeight = height - MARGIN.top - MARGIN.bottom
	const totals = labels.map((_, index) =>
		series.reduce((sum, item) => sum + Math.max(0, item.data[index] ?? 0), 0),
	)
	const max = niceMax(Math.max(0, ...totals))
	const band = count > 0 ? plotWidth / count : 0
	const barWidth = Math.min(MAX_BAR, band * 0.6)
	const y = (value: number) => MARGIN.top + (1 - value / max) * plotHeight
	const ticks = [0, 1, 2, 3, 4].map((index) => (max / 4) * index)
	const labelEvery = Math.max(1, Math.ceil(count / Math.max(1, Math.floor(plotWidth / 44))))
	const bandX = (index: number) => MARGIN.left + band * index
	const tooltipOnLeft = active !== null && bandX(active) + band / 2 > width / 2

	const indexFromPointer = (event: PointerEvent<SVGRectElement>) => {
		const rect = event.currentTarget.getBoundingClientRect()

		return Math.min(count - 1, Math.max(0, Math.floor((event.clientX - rect.left) / band)))
	}

	return (
		<figure className={cn('flex flex-col gap-3', className)}>
			<div
				ref={containerRef}
				className="has-focus-visible:outline-foreground relative w-full rounded-lg has-focus-visible:outline-2 has-focus-visible:outline-offset-4"
				style={{ height }}
			>
				<input
					type="range"
					min={0}
					max={Math.max(0, count - 1)}
					step={1}
					value={active ?? 0}
					aria-label={caption}
					aria-valuetext={(() => {
						const index = active ?? 0
						const values = series
							.map((item) => `${item.label} ${format(item.data[index] ?? 0)}`)
							.join(', ')
						return `${labels[index] ?? ''}: ${values}`
					})()}
					onFocus={() => setActive((current) => current ?? 0)}
					onBlur={() => setActive(null)}
					onChange={(event) => setActive(Number(event.target.value))}
					className="pointer-events-none absolute inset-0 size-full opacity-0"
				/>
				{width > 0 && (
					<svg
						width={width}
						height={height}
						aria-hidden="true"
						className="overflow-visible"
					>
						{ticks.map((tick) => (
							<g key={tick}>
								<line
									x1={MARGIN.left}
									x2={width - MARGIN.right}
									y1={y(tick)}
									y2={y(tick)}
									className={
										tick === 0 ? 'stroke-chart-axis' : 'stroke-chart-grid'
									}
									strokeWidth={1}
								/>
								<text
									x={MARGIN.left - 8}
									y={y(tick)}
									textAnchor="end"
									dominantBaseline="middle"
									className="fill-muted-foreground text-[11px]"
								>
									{compact.format(tick)}
								</text>
							</g>
						))}
						{labels.map((label, index) => (
							<g key={label} opacity={active === null || active === index ? 1 : 0.5}>
								{index % labelEvery === 0 && (
									<text
										x={bandX(index) + band / 2}
										y={height - 8}
										textAnchor="middle"
										className="fill-muted-foreground text-[11px]"
									>
										{label}
									</text>
								)}
								{(() => {
									let stacked = 0
									const lastIndex = series.reduce(
										(last, item, seriesIndex) =>
											(item.data[index] ?? 0) > 0 ? seriesIndex : last,
										-1,
									)

									return series.map((item, seriesIndex) => {
										const value = Math.max(0, item.data[index] ?? 0)

										if (value === 0) {
											return null
										}

										const top = y(stacked + value)
										const bottom = y(stacked)
										const gap = seriesIndex === 0 || stacked === 0 ? 0 : GAP
										const segmentHeight = Math.max(1, bottom - top - gap)
										stacked += value

										return (
											<path
												key={item.id}
												d={barPath(
													bandX(index) + (band - barWidth) / 2,
													top,
													barWidth,
													segmentHeight,
													seriesIndex === lastIndex,
												)}
												fill={`var(--series-${seriesIndex + 1})`}
											/>
										)
									})
								})()}
							</g>
						))}
						<rect
							x={MARGIN.left}
							y={MARGIN.top}
							width={plotWidth}
							height={plotHeight}
							fill="transparent"
							onPointerMove={(event) => setActive(indexFromPointer(event))}
							onPointerLeave={() => setActive(null)}
						/>
					</svg>
				)}
				{active !== null && (
					<div
						className="border-border bg-popover text-popover-foreground pointer-events-none absolute z-10 flex min-w-36 flex-col gap-1.5 rounded-lg border p-3 text-xs shadow-md"
						style={{
							top: MARGIN.top,
							left: tooltipOnLeft
								? undefined
								: bandX(active) + band / 2 + barWidth / 2 + 8,
							right: tooltipOnLeft
								? width - (bandX(active) + band / 2) + barWidth / 2 + 8
								: undefined,
						}}
					>
						<p className="text-muted-foreground font-medium">{labels[active]}</p>
						{series.map((item, seriesIndex) => (
							<p key={item.id} className="flex items-center gap-2">
								<span
									aria-hidden="true"
									className="size-2 shrink-0 rounded-[2px]"
									style={{ background: `var(--series-${seriesIndex + 1})` }}
								/>
								<span className="text-sm font-semibold">
									{format(item.data[active] ?? 0)}
								</span>
								{series.length > 1 && (
									<span className="text-muted-foreground">{item.label}</span>
								)}
							</p>
						))}
					</div>
				)}
			</div>
			{series.length > 1 && (
				<ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
					{series.map((item, seriesIndex) => (
						<li key={item.id} className="flex items-center gap-2">
							<span
								aria-hidden="true"
								className="size-2 rounded-[2px]"
								style={{ background: `var(--series-${seriesIndex + 1})` }}
							/>
							{item.label}
						</li>
					))}
				</ul>
			)}
			<table className="sr-only">
				<caption>{caption}</caption>
				<thead>
					<tr>
						<th scope="col">Period</th>
						{series.map((item) => (
							<th key={item.id} scope="col">
								{item.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{labels.map((label, index) => (
						<tr key={label}>
							<th scope="row">{label}</th>
							{series.map((item) => (
								<td key={item.id}>{format(item.data[index] ?? 0)}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</figure>
	)
}
