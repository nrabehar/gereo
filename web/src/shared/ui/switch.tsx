import { CircleAlertIcon } from 'lucide-react'
import { useId, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '$/cn'

type SwitchProps = Omit<ComponentProps<'input'>, 'type' | 'size'> & {
	label?: ReactNode
	info?: ReactNode
	error?: ReactNode
}

export const Switch = ({
	label,
	info,
	error,
	className,
	id,
	checked,
	defaultChecked,
	onChange,
	'aria-invalid': ariaInvalid,
	'aria-describedby': ariaDescribedBy,
	...props
}: SwitchProps) => {
	const generatedId = useId()
	const [uncontrolledChecked, setUncontrolledChecked] = useState(Boolean(defaultChecked))
	const isChecked = checked ?? uncontrolledChecked
	const inputId = id ?? generatedId
	const messageId = `${inputId}-message`
	const message = error || info

	const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ')

	const box = (
		<span className="relative inline-flex h-6 w-10 shrink-0 items-center">
			<input
				id={inputId}
				type="checkbox"
				role="switch"
				checked={checked}
				defaultChecked={defaultChecked}
				aria-checked={isChecked}
				onChange={(event) => {
					setUncontrolledChecked(event.target.checked)
					onChange?.(event)
				}}
				aria-invalid={error ? true : ariaInvalid}
				aria-describedby={describedBy || undefined}
				className={cn(
					'peer border-muted-foreground/70 bg-background absolute inset-0 h-6 w-10 cursor-pointer appearance-none rounded-full border shadow-xs transition-[background-color,border-color] duration-150 ease-out-strong outline-none hover:border-muted-foreground checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground aria-invalid:border-destructive disabled:cursor-not-allowed',
					className,
				)}
				{...props}
			/>
			<span
				aria-hidden="true"
				className="bg-muted-foreground peer-checked:bg-primary-foreground pointer-events-none absolute start-1 size-4 rounded-full shadow-xs transition-[translate,background-color] duration-200 ease-out-strong peer-checked:translate-x-4 peer-disabled:opacity-50 rtl:peer-checked:-translate-x-4 motion-reduce:transition-colors"
			/>
		</span>
	)

	return (
		<div className="flex flex-col gap-1.5">
			{label ? (
				<label className="flex cursor-pointer items-center gap-2.5 text-sm leading-snug has-disabled:cursor-not-allowed has-disabled:opacity-50">
					{box}
					<span>{label}</span>
				</label>
			) : (
				box
			)}
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
