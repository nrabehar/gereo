import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

import { cn } from '$/cn'

type LineChartSeries = {
	id: string
	label: string
	data: number[]
}

type LineChartProps = {
	labels: string[]
	series: LineChartSeries[]
	caption: string
	area?: boolean
	height?: number
	formatValue?: (value: number) => string
	locale?: string
	className?: string
}

const MARGIN = { top: 12, right: 16, bottom: 28, left: 48 }

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

export const LineChart = ({
	labels,
	series,
	caption,
	area = false,
	height = 240,
	formatValue,
	locale = 'fr-FR',
	className,
}: LineChartProps) => {
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
	const max = niceMax(Math.max(0, ...series.flatMap((item) => item.data)))
	const step = count > 1 ? plotWidth / (count - 1) : 0
	const x = (index: number) => MARGIN.left + (count > 1 ? index * step : plotWidth / 2)
	const y = (value: number) => MARGIN.top + (1 - value / max) * plotHeight
	const ticks = [0, 1, 2, 3, 4].map((index) => (max / 4) * index)
	const labelEvery = Math.max(1, Math.ceil(count / Math.max(1, Math.floor(plotWidth / 48))))

	const indexFromPointer = (event: PointerEvent<SVGRectElement>) => {
		const rect = event.currentTarget.getBoundingClientRect()
		const offset = event.clientX - rect.left

		return count > 1 ? Math.min(count - 1, Math.max(0, Math.round(offset / step))) : 0
	}

	const activeX = active === null ? 0 : x(active)
	const tooltipOnLeft = activeX > width / 2

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
					value={active ?? count - 1}
					aria-label={caption}
					aria-valuetext={(() => {
						const index = active ?? count - 1
						const values = series
							.map((item) => `${item.label} ${format(item.data[index] ?? 0)}`)
							.join(', ')
						return `${labels[index] ?? ''}: ${values}`
					})()}
					onFocus={() => setActive((current) => current ?? count - 1)}
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
						{labels.map((label, index) =>
							index % labelEvery === 0 ? (
								<text
									key={label}
									x={x(index)}
									y={height - 8}
									textAnchor="middle"
									className="fill-muted-foreground text-[11px]"
								>
									{label}
								</text>
							) : null,
						)}
						{series.map((item, seriesIndex) => {
							const path = item.data
								.map(
									(value, index) =>
										`${index === 0 ? 'M' : 'L'}${x(index)},${y(value)}`,
								)
								.join(' ')
							const color = `var(--series-${seriesIndex + 1})`

							return (
								<g key={item.id}>
									{area && count > 1 && (
										<path
											d={`${path} L${x(count - 1)},${y(0)} L${x(0)},${y(0)} Z`}
											fill={color}
											opacity={0.1}
										/>
									)}
									<path
										d={path}
										fill="none"
										stroke={color}
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
							)
						})}
						{active !== null && (
							<g>
								<line
									x1={activeX}
									x2={activeX}
									y1={MARGIN.top}
									y2={y(0)}
									className="stroke-chart-axis"
									strokeWidth={1}
								/>
								{series.map((item, seriesIndex) => (
									<circle
										key={item.id}
										cx={activeX}
										cy={y(item.data[active] ?? 0)}
										r={4}
										fill={`var(--series-${seriesIndex + 1})`}
										className="stroke-card"
										strokeWidth={2}
									/>
								))}
							</g>
						)}
						<rect
							x={MARGIN.left - step / 2}
							y={MARGIN.top}
							width={plotWidth + step}
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
							left: tooltipOnLeft ? undefined : activeX + 12,
							right: tooltipOnLeft ? width - activeX + 12 : undefined,
						}}
					>
						<p className="text-muted-foreground font-medium">{labels[active]}</p>
						{series.map((item, seriesIndex) => (
							<p key={item.id} className="flex items-center gap-2">
								<span
									aria-hidden="true"
									className="h-0.5 w-3 shrink-0 rounded-full"
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
								className="h-0.5 w-3 rounded-full"
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
