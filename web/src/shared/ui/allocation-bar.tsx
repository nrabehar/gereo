import { cn } from '$/cn'

type AllocationSegment = {
	label: string
	value: number
}

type AllocationBarProps = {
	segments: AllocationSegment[]
	showTotal?: boolean
	unallocatedLabel?: string
	allocatedLabel?: string
	locale?: string
	className?: string
}

const colors = [
	'bg-series-1',
	'bg-series-2',
	'bg-series-3',
	'bg-series-4',
	'bg-series-5',
	'bg-series-6',
	'bg-series-7',
	'bg-series-8',
]

export const AllocationBar = ({
	segments,
	showTotal = true,
	unallocatedLabel = 'Unallocated',
	allocatedLabel = 'Allocated',
	locale = 'fr-FR',
	className,
}: AllocationBarProps) => {
	const format = (value: number) =>
		new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value) + ' %'

	const total = segments.reduce((sum, segment) => sum + segment.value, 0)
	const scale = Math.max(100, total)
	const remaining = Math.max(0, 100 - total)

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<div
				aria-hidden="true"
				className="bg-muted ring-border flex h-3 w-full gap-0.5 overflow-hidden rounded-full ring-1 ring-inset"
			>
				{segments.map((segment, index) => (
					<div
						key={segment.label}
						className={cn(
							'min-w-1 rounded-full transition-[width] duration-300 ease-out-strong motion-reduce:transition-none',
							colors[index % colors.length],
						)}
						style={{ width: `${(Math.max(0, segment.value) / scale) * 100}%` }}
					/>
				))}
			</div>
			<ul className="flex flex-col gap-1.5 text-sm">
				{segments.map((segment, index) => (
					<li key={segment.label} className="flex items-center gap-2">
						<span
							aria-hidden="true"
							className={cn(
								'size-2.5 shrink-0 rounded-full',
								colors[index % colors.length],
							)}
						/>
						<span className="flex-1 truncate">{segment.label}</span>
						<span className="text-muted-foreground tabular-nums">
							{format(segment.value)}
						</span>
					</li>
				))}
				{remaining > 0 && (
					<li className="text-muted-foreground flex items-center gap-2">
						<span
							aria-hidden="true"
							className="bg-muted ring-border size-2.5 shrink-0 rounded-full ring-1 ring-inset"
						/>
						<span className="flex-1 truncate">{unallocatedLabel}</span>
						<span className="tabular-nums">{format(remaining)}</span>
					</li>
				)}
			</ul>
			{showTotal && (
				<p className="text-muted-foreground border-border flex items-center justify-between border-t pt-2 text-xs">
					<span>{allocatedLabel}</span>
					<span className="text-foreground font-medium tabular-nums">
						{format(total)}
					</span>
				</p>
			)}
		</div>
	)
}
