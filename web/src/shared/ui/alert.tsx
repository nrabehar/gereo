import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

const alertVariants = cva('flex items-start gap-3 rounded-xl border p-4 text-sm', {
	variants: {
		variant: {
			info: 'border-border bg-muted text-foreground',
			success:
				'border-emerald-500/40 bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--background))] text-foreground',
			warning:
				'border-amber-500/50 bg-[color-mix(in_oklab,var(--color-amber-500)_14%,var(--background))] text-foreground',
			destructive:
				'border-destructive/40 bg-[color-mix(in_oklab,var(--destructive)_10%,var(--background))] text-foreground',
		},
	},
	defaultVariants: {
		variant: 'info',
	},
})

const icons: Record<NonNullable<VariantProps<typeof alertVariants>['variant']>, LucideIcon> = {
	info: InfoIcon,
	success: CircleCheckIcon,
	warning: TriangleAlertIcon,
	destructive: CircleAlertIcon,
}

const iconColors = {
	info: 'text-muted-foreground',
	success: 'text-emerald-700 dark:text-emerald-400',
	warning: 'text-amber-700 dark:text-amber-400',
	destructive: 'text-red-700 dark:text-red-400',
}

type AlertProps = VariantProps<typeof alertVariants> & {
	title?: string
	children?: ReactNode
	action?: ReactNode
	onDismiss?: () => void
	className?: string
}

export const Alert = ({
	variant = 'info',
	title,
	children,
	action,
	onDismiss,
	className,
}: AlertProps) => {
	const resolved = variant ?? 'info'
	const Icon = icons[resolved]

	return (
		<div
			role={resolved === 'destructive' || resolved === 'warning' ? 'alert' : 'status'}
			className={cn(alertVariants({ variant }), className)}
		>
			<Icon
				aria-hidden="true"
				className={cn('mt-0.5 size-4 shrink-0', iconColors[resolved])}
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				{title && <p className="leading-snug font-medium">{title}</p>}
				{children && <div className="text-muted-foreground text-pretty">{children}</div>}
				{action && <div className="mt-2 flex flex-wrap gap-2">{action}</div>}
			</div>
			{onDismiss && (
				<button
					type="button"
					aria-label="Dismiss"
					onClick={onDismiss}
					className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 active:bg-foreground/10 focus-visible:outline-foreground -m-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-md transition-[color,background-color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 motion-safe:active:scale-95"
				>
					<XIcon aria-hidden="true" className="size-4" />
				</button>
			)}
		</div>
	)
}
