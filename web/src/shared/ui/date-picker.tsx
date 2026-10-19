import { Popover } from '@base-ui/react/popover'
import { CalendarIcon, ChevronDownIcon, CircleAlertIcon } from 'lucide-react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'
import { Calendar } from '@ui/calendar'

type DatePickerProps = {
	value?: Date | null
	defaultValue?: Date | null
	onValueChange?: (value: Date) => void
	min?: Date
	max?: Date
	locale?: string
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	label?: string
	info?: ReactNode
	error?: ReactNode
	placeholder?: string
	required?: boolean
	disabled?: boolean
	id?: string
	className?: string
	'aria-label'?: string
}

export const DatePicker = ({
	value,
	defaultValue = null,
	onValueChange,
	min,
	max,
	locale = 'fr-FR',
	weekStartsOn,
	label,
	info,
	error,
	placeholder = 'Select a date',
	required,
	disabled,
	id,
	className,
	'aria-label': ariaLabel,
}: DatePickerProps) => {
	const generatedId = useId()
	const triggerId = id ?? generatedId
	const messageId = `${triggerId}-message`
	const labelId = `${triggerId}-label`
	const valueId = `${triggerId}-value`
	const message = error || info
	const [open, setOpen] = useState(false)
	const [internal, setInternal] = useState<Date | null>(defaultValue)
	const selected = value === undefined ? internal : value

	const formatted = selected
		? new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(selected)
		: null

	const field = (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger
				id={triggerId}
				disabled={disabled}
				aria-label={ariaLabel}
				aria-labelledby={label && !ariaLabel ? `${labelId} ${valueId}` : undefined}
				aria-invalid={error ? true : undefined}
				aria-describedby={message ? messageId : undefined}
				className={cn(
					'border-muted-foreground/70 bg-background text-foreground hover:border-muted-foreground focus-visible:border-foreground focus-visible:ring-foreground/10 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20 data-popup-open:border-foreground flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 text-start text-sm shadow-xs transition-[border-color,box-shadow] duration-150 ease-out-strong outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-muted-foreground/70',
					className,
				)}
			>
				<CalendarIcon
					aria-hidden="true"
					className="text-muted-foreground size-4 shrink-0"
				/>
				<span
					id={valueId}
					className={cn('flex-1 truncate', !formatted && 'text-muted-foreground')}
				>
					{formatted ?? placeholder}
				</span>
				<ChevronDownIcon
					aria-hidden="true"
					className="text-muted-foreground size-4 shrink-0"
				/>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner side="bottom" align="start" sideOffset={6} className="z-50">
					<Popover.Popup className="border-border bg-popover text-popover-foreground origin-(--transform-origin) rounded-xl border p-3 shadow-lg outline-none transition-[scale,opacity] duration-150 ease-out-strong data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100">
						<Calendar
							focusOnMount
							value={selected}
							min={min}
							max={max}
							locale={locale}
							weekStartsOn={weekStartsOn}
							onValueChange={(date) => {
								setInternal(date)
								onValueChange?.(date)
								setOpen(false)
							}}
						/>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	)

	if (!label && !message) {
		return field
	}

	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label
					id={labelId}
					htmlFor={triggerId}
					className="text-sm leading-none font-medium"
				>
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
			{field}
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
