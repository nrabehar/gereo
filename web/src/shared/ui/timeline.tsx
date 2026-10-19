import { CircleIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type TimelineTone = 'neutral' | 'primary' | 'success' | 'destructive'

type TimelineItem = {
	id: string
	title: ReactNode
	description?: ReactNode
	time: ReactNode
	icon?: LucideIcon
	tone?: TimelineTone
	aside?: ReactNode
}

type TimelineProps = {
	items: TimelineItem[]
	className?: string
}

const tones: Record<TimelineTone, string> = {
	neutral: 'bg-muted text-muted-foreground ring-border',
	primary: 'bg-primary/20 text-foreground ring-primary/40',
	success: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-400',
	destructive: 'bg-destructive/10 text-red-700 ring-destructive/30 dark:text-red-400',
}

export const Timeline = ({ items, className }: TimelineProps) => (
	<ol className={cn('flex flex-col', className)}>
		{items.map((item, index) => {
			const isLast = index === items.length - 1
			const Icon = item.icon ?? CircleIcon

			return (
				<li key={item.id} className="flex gap-3">
					<div className="flex flex-col items-center">
						<span
							className={cn(
								'grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-inset',
								tones[item.tone ?? 'neutral'],
							)}
						>
							<Icon aria-hidden="true" className="size-4" />
						</span>
						{!isLast && (
							<span aria-hidden="true" className="bg-border my-1 w-px flex-1" />
						)}
					</div>
					<div className={cn('flex min-w-0 flex-1 items-start gap-3', !isLast && 'pb-6')}>
						<div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-1">
							<p className="text-sm leading-snug font-medium">{item.title}</p>
							{item.description && (
								<p className="text-muted-foreground text-sm text-pretty">
									{item.description}
								</p>
							)}
							<p className="text-muted-foreground text-xs">{item.time}</p>
						</div>
						{item.aside && (
							<div className="pt-1 text-sm font-medium whitespace-nowrap">
								{item.aside}
							</div>
						)}
					</div>
				</li>
			)
		})}
	</ol>
)
