import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '$/cn'

const badgeVariants = cva(
	'inline-flex shrink-0 items-center gap-1 rounded-full font-medium whitespace-nowrap [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				neutral: 'bg-muted text-foreground ring-1 ring-border ring-inset',
				primary: 'bg-primary/20 text-foreground ring-1 ring-primary/40 ring-inset',
				success:
					'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 ring-inset dark:text-emerald-400',
				destructive:
					'bg-destructive/10 text-red-700 ring-1 ring-destructive/30 ring-inset dark:text-red-400',
				outline: 'text-foreground ring-1 ring-border ring-inset',
			},
			size: {
				sm: 'h-5 px-2 text-xs [&_svg]:size-3',
				md: 'h-6 px-2.5 text-xs [&_svg]:size-3.5',
			},
		},
		defaultVariants: {
			variant: 'neutral',
			size: 'md',
		},
	},
)

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export const Badge = ({ variant, size, className, ...props }: BadgeProps) => (
	<span className={cn(badgeVariants({ variant, size }), className)} {...props} />
)
