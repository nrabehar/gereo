import { Separator as BaseSeparator } from '@base-ui/react/separator'

import { cn } from '$/cn'

type SeparatorProps = {
	orientation?: 'horizontal' | 'vertical'
	className?: string
}

export const Separator = ({ orientation = 'horizontal', className }: SeparatorProps) => (
	<BaseSeparator
		orientation={orientation}
		className={cn(
			'bg-border shrink-0',
			orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
			className,
		)}
	/>
)
