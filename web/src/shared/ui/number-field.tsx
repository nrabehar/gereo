import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { CircleAlertIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

const groupVariants = cva(
	'border-muted-foreground/70 bg-background has-focus-visible:border-foreground has-focus-visible:ring-foreground/10 hover:border-muted-foreground flex w-full items-stretch overflow-hidden border shadow-xs transition-[border-color,box-shadow] duration-150 ease-out-strong has-focus-visible:ring-[3px] has-aria-invalid:border-destructive has-aria-invalid:has-focus-visible:ring-destructive/20 has-disabled:cursor-not-allowed has-disabled:opacity-50',
	{
		variants: {
			size: {
				sm: 'h-8 rounded-md text-xs max-sm:text-base',
				md: 'h-10 rounded-lg text-sm max-sm:text-base',
				lg: 'h-12 rounded-xl text-base',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)

const stepperClassName =
	'text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent grid aspect-square h-full cursor-pointer place-items-center transition-[color,background-color] duration-150 ease-out-strong outline-none select-none focus-visible:bg-muted disabled:cursor-not-allowed disabled:opacity-40'

type NumberFieldProps = VariantProps<typeof groupVariants> & {
	value?: number | null
	defaultValue?: number
	onValueChange?: (value: number | null) => void
	min?: number
	max?: number
	step?: number
	format?: Intl.NumberFormatOptions
	locale?: string
	label?: string
	info?: ReactNode
	error?: ReactNode
	name?: string
	id?: string
	required?: boolean
	disabled?: boolean
	className?: string
	'aria-label'?: string
}

export const NumberField = ({
	value,
	defaultValue,
	onValueChange,
	min,
	max,
	step,
	format,
	locale = 'fr-FR',
	label,
	info,
	error,
	size,
	name,
	id,
	required,
	disabled,
	className,
	'aria-label': ariaLabel,
}: NumberFieldProps) => {
	const generatedId = useId()
	const rootId = id ?? generatedId
	const messageId = `${rootId}-message`
	const message = error || info

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			{label && (
				<label htmlFor={rootId} className="text-sm leading-none font-medium">
					{label}
					{required && (
						<span
							aria-hidden="true"
							className="text-destructive ml-0.5 dark:text-red-400"
						>
							*
						</span>
					)}
				</label>
			)}
			<BaseNumberField.Root
				id={rootId}
				value={value}
				defaultValue={defaultValue}
				onValueChange={(next) => onValueChange?.(next)}
				min={min}
				max={max}
				step={step}
				format={format}
				locale={locale}
				name={name}
				required={required}
				disabled={disabled}
			>
				<BaseNumberField.Group className={groupVariants({ size })}>
					<BaseNumberField.Decrement
						aria-label="Decrease"
						className={cn(stepperClassName, 'border-muted-foreground/40 border-e')}
					>
						<MinusIcon aria-hidden="true" className="size-4" />
					</BaseNumberField.Decrement>
					<BaseNumberField.Input
						aria-label={label ? undefined : ariaLabel}
						aria-invalid={error ? true : undefined}
						aria-describedby={message ? messageId : undefined}
						className="min-w-0 flex-1 bg-transparent px-3 text-center tabular-nums outline-none"
					/>
					<BaseNumberField.Increment
						aria-label="Increase"
						className={cn(stepperClassName, 'border-muted-foreground/40 border-s')}
					>
						<PlusIcon aria-hidden="true" className="size-4" />
					</BaseNumberField.Increment>
				</BaseNumberField.Group>
			</BaseNumberField.Root>
			{error ? (
				<p
					id={messageId}
					role="alert"
					className="text-destructive flex items-start gap-1.5 text-xs font-medium text-pretty transition-opacity duration-150 ease-out-strong starting:opacity-0 dark:text-red-400"
				>
					<CircleAlertIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" />
					{error}
				</p>
			) : (
				info && (
					<p
						id={messageId}
						className="text-muted-foreground text-xs text-pretty transition-opacity duration-150 ease-out-strong starting:opacity-0"
					>
						{info}
					</p>
				)
			)}
		</div>
	)
}
