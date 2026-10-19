import { Slider as BaseSlider } from '@base-ui/react/slider'

import { cn } from '$/cn'

type SliderProps = {
	value?: number
	defaultValue?: number
	onValueChange?: (value: number) => void
	min?: number
	max?: number
	step?: number
	label?: string
	showValue?: boolean
	disabled?: boolean
	className?: string
	'aria-label'?: string
}

export const Slider = ({
	value,
	defaultValue,
	onValueChange,
	min = 0,
	max = 100,
	step = 1,
	label,
	showValue = false,
	disabled,
	className,
	'aria-label': ariaLabel,
}: SliderProps) => (
	<BaseSlider.Root
		value={value}
		defaultValue={value === undefined ? (defaultValue ?? min) : undefined}
		onValueChange={(next) => onValueChange?.(Array.isArray(next) ? (next[0] ?? min) : next)}
		min={min}
		max={max}
		step={step}
		disabled={disabled}
		className={cn('flex w-full flex-col gap-2', disabled && 'opacity-50', className)}
	>
		{(label || showValue) && (
			<div className="flex items-center justify-between gap-3 text-sm">
				{label && <BaseSlider.Label className="font-medium">{label}</BaseSlider.Label>}
				{showValue && (
					<BaseSlider.Value className="text-muted-foreground ms-auto tabular-nums" />
				)}
			</div>
		)}
		<BaseSlider.Control className="flex w-full touch-none items-center py-2 select-none data-disabled:cursor-not-allowed">
			<BaseSlider.Track className="bg-muted ring-border h-1.5 w-full rounded-full ring-1 select-none ring-inset">
				<BaseSlider.Indicator className="bg-primary rounded-full select-none" />
				<BaseSlider.Thumb
					aria-label={label ? undefined : ariaLabel}
					className="border-primary bg-background has-focus-visible:outline-foreground size-5 cursor-grab rounded-full border-2 shadow-sm transition-[scale] duration-150 ease-out-strong select-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 data-dragging:cursor-grabbing motion-safe:data-dragging:scale-110"
				/>
			</BaseSlider.Track>
		</BaseSlider.Control>
	</BaseSlider.Root>
)
