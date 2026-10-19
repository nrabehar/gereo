import { OTPField } from '@base-ui/react/otp-field'
import { CircleAlertIcon } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type OtpInputProps = {
	length?: number
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	onComplete?: (value: string) => void
	label?: string
	info?: ReactNode
	error?: ReactNode
	mask?: boolean
	disabled?: boolean
	required?: boolean
	name?: string
	id?: string
	className?: string
}

export const OtpInput = ({
	length = 6,
	value,
	defaultValue,
	onValueChange,
	onComplete,
	label,
	info,
	error,
	mask,
	disabled,
	required,
	name,
	id,
	className,
}: OtpInputProps) => {
	const generatedId = useId()
	const rootId = id ?? generatedId
	const messageId = `${rootId}-message`
	const message = error || info
	const slots = Array.from({ length }, (_, index) => `${rootId}-slot-${index}`)

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
			<OTPField.Root
				id={rootId}
				length={length}
				value={value}
				defaultValue={defaultValue}
				onValueChange={(next) => onValueChange?.(next)}
				onValueComplete={(next) => onComplete?.(next)}
				mask={mask}
				disabled={disabled}
				required={required}
				name={name}
				aria-describedby={message ? messageId : undefined}
				className="flex w-full gap-2"
			>
				{slots.map((slotId, index) => (
					<OTPField.Input
						key={slotId}
						aria-label={index === 0 ? undefined : `Character ${index + 1} of ${length}`}
						aria-invalid={error ? true : undefined}
						className="border-muted-foreground/70 bg-background text-foreground hover:border-muted-foreground focus-visible:border-foreground focus-visible:ring-foreground/10 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20 h-12 min-w-0 flex-1 rounded-xl border text-center text-lg font-semibold tabular-nums shadow-xs transition-[border-color,box-shadow] duration-150 ease-out-strong outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-muted-foreground/70 max-sm:text-base sm:max-w-12"
					/>
				))}
			</OTPField.Root>
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
