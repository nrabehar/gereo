import { useState } from 'react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type DonutSlice = {
	id: string
	label: string
	value: number
}

type DonutChartProps = {
	slices: DonutSlice[]
	caption: string
	size?: number
	thickness?: number
	centerLabel?: string
	centerValue?: ReactNode
	formatValue?: (value: number) => string
	locale?: string
	className?: string
}

const GAP = 2

export const DonutChart = ({
	slices,
	caption,
	size = 168,
	thickness = 20,
	centerLabel,
	centerValue,
	formatValue,
	locale = 'fr-FR',
	className,
}: DonutChartProps) => {
	const [active, setActive] = useState<number | null>(null)
	const full = new Intl.NumberFormat(locale)
	const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 })
	const format = formatValue ?? ((value: number) => full.format(value))

	const total = slices.reduce((sum, slice) => sum + Math.max(0, slice.value), 0)
	const radius = (size - thickness) / 2
	const circumference = 2 * Math.PI * radius
	let offset = 0

	return (
		<figure className={cn('flex flex-wrap items-center gap-6', className)}>
			<div className="relative shrink-0" style={{ width: size, height: size }}>
				<svg width={size} height={size} aria-hidden="true" className="-rotate-90">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						strokeWidth={thickness}
						className="stroke-muted"
					/>
					{total > 0 &&
						slices.map((slice, index) => {
							const length = (Math.max(0, slice.value) / total) * circumference
							const dash = Math.max(0, length - (slices.length > 1 ? GAP : 0))
							const start = offset
							offset += length

							return (
								<circle
									key={slice.id}
									cx={size / 2}
									cy={size / 2}
									r={radius}
									fill="none"
									strokeWidth={thickness}
									stroke={`var(--series-${index + 1})`}
									strokeDasharray={`${dash} ${circumference - dash}`}
									strokeDashoffset={-start}
									opacity={active === null || active === index ? 1 : 0.4}
									className="transition-opacity duration-150 ease-out-strong"
									onPointerEnter={() => setActive(index)}
									onPointerLeave={() => setActive(null)}
								/>
							)
						})}
				</svg>
				{(centerLabel || centerValue) && (
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
						{active !== null && slices[active] ? (
							<>
								<span className="text-muted-foreground text-xs">
									{slices[active].label}
								</span>
								<span className="font-heading text-lg font-semibold">
									{percent.format(total > 0 ? slices[active].value / total : 0)}
								</span>
							</>
						) : (
							<>
								{centerLabel && (
									<span className="text-muted-foreground text-xs">
										{centerLabel}
									</span>
								)}
								{centerValue && (
									<span className="font-heading text-lg font-semibold">
										{centerValue}
									</span>
								)}
							</>
						)}
					</div>
				)}
			</div>
			<ul aria-label={caption} className="flex min-w-40 flex-1 flex-col gap-1 text-sm">
				{slices.map((slice, index) => (
					<li
						key={slice.id}
						onPointerEnter={() => setActive(index)}
						onPointerLeave={() => setActive(null)}
						className={cn(
							'flex items-center gap-2 rounded-md px-2 py-1 transition-opacity duration-150 ease-out-strong',
							active !== null && active !== index && 'opacity-50',
						)}
					>
						<span
							aria-hidden="true"
							className="size-2.5 shrink-0 rounded-[3px]"
							style={{ background: `var(--series-${index + 1})` }}
						/>
						<span className="flex-1 truncate">{slice.label}</span>
						<span className="font-medium tabular-nums">{format(slice.value)}</span>
						<span className="text-muted-foreground w-12 text-end tabular-nums">
							{percent.format(total > 0 ? slice.value / total : 0)}
						</span>
					</li>
				))}
			</ul>
		</figure>
	)
}
