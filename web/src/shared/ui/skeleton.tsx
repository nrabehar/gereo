import type { ComponentProps } from 'react'

import { cn } from '$/cn'

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => (
	<div
		aria-hidden="true"
		className={cn('bg-muted animate-pulse rounded-md motion-reduce:animate-none', className)}
		{...props}
	/>
)
