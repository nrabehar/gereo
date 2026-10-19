import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type EmptyStateProps = {
	icon?: LucideIcon
	title: string
	description?: ReactNode
	action?: ReactNode
	className?: string
}

export const EmptyState = ({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) => (
	<div
		className={cn(
			'border-border flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center',
			className,
		)}
	>
		{Icon && (
			<span className="bg-muted text-muted-foreground ring-border grid size-12 place-items-center rounded-full ring-1 ring-inset">
				<Icon aria-hidden="true" className="size-5" />
			</span>
		)}
		<div className="flex max-w-sm flex-col gap-1">
			<h3 className="font-heading text-base font-semibold tracking-[-0.01em]">{title}</h3>
			{description && (
				<p className="text-muted-foreground text-sm text-pretty">{description}</p>
			)}
		</div>
		{action && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
	</div>
)
