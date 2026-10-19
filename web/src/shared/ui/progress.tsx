import { Progress as BaseProgress } from '@base-ui/react/progress'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '$/cn'

const trackVariants = cva(
	'bg-muted ring-border w-full overflow-hidden rounded-full ring-1 ring-inset',
	{
		variants: {
			size: {
				sm: 'h-1.5',
				md: 'h-2.5',
				lg: 'h-4',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)

type ProgressProps = VariantProps<typeof trackVariants> & {
	value: number | null
	label?: string
	showValue?: boolean
	className?: string
	'aria-label'?: string
}

export const Progress = ({
	value,
	label,
	showValue = false,
	size,
	className,
	'aria-label': ariaLabel,
}: ProgressProps) => (
	<BaseProgress.Root
		value={value}
		aria-label={label ? undefined : ariaLabel}
		className={cn('flex w-full flex-col gap-2', className)}
	>
		{(label || showValue) && (
			<div className="flex items-center justify-between gap-3 text-sm">
				{label && <BaseProgress.Label className="font-medium">{label}</BaseProgress.Label>}
				{showValue && (
					<BaseProgress.Value className="text-muted-foreground ms-auto tabular-nums" />
				)}
			</div>
		)}
		<BaseProgress.Track className={trackVariants({ size })}>
			<BaseProgress.Indicator className="bg-primary rounded-full transition-[width] duration-500 ease-out-strong data-indeterminate:w-1/3 data-indeterminate:animate-indeterminate data-indeterminate:transition-none motion-reduce:transition-none motion-reduce:data-indeterminate:animate-pulse" />
		</BaseProgress.Track>
	</BaseProgress.Root>
)
