import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'
import { Card } from '@ui/card'
import { Sparkline } from '@ui/sparkline'

type StatProps = {
	label: string
	value: ReactNode
	delta?: { value: number; label?: string }
	hint?: ReactNode
	icon?: LucideIcon
	trend?: number[]
	locale?: string
	className?: string
}

export const Stat = ({
	label,
	value,
	delta,
	hint,
	icon: Icon,
	trend,
	locale = 'fr-FR',
	className,
}: StatProps) => {
	const positive = delta !== undefined && delta.value > 0
	const negative = delta !== undefined && delta.value < 0
	const DeltaIcon = negative ? TrendingDownIcon : TrendingUpIcon

	return (
		<Card className={cn('min-w-0 gap-3 p-5', className)}>
			<div className="text-muted-foreground flex items-center justify-between gap-3 text-sm font-medium">
				<span>{label}</span>
				{Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
			</div>
			<div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
				<div className="font-heading text-3xl leading-none font-semibold tracking-[-0.02em]">
					{value}
				</div>
				{trend && <Sparkline data={trend} />}
			</div>
			{(delta || hint) && (
				<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
					{delta && (
						<span
							className={cn(
								'inline-flex items-center gap-1 font-medium tabular-nums',
								positive && 'text-emerald-700 dark:text-emerald-400',
								negative && 'text-red-700 dark:text-red-400',
								!positive && !negative && 'text-muted-foreground',
							)}
						>
							{(positive || negative) && (
								<DeltaIcon aria-hidden="true" className="size-3.5" />
							)}
							{new Intl.NumberFormat(locale, {
								style: 'percent',
								maximumFractionDigits: 1,
								signDisplay: 'exceptZero',
							}).format(delta.value / 100)}
						</span>
					)}
					{(delta?.label || hint) && (
						<span className="text-muted-foreground">{delta?.label ?? hint}</span>
					)}
				</div>
			)}
		</Card>
	)
}
