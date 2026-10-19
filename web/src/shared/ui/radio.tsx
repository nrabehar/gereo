import { CircleAlertIcon } from 'lucide-react'
import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '$/cn'

type RadioProps = Omit<ComponentProps<'input'>, 'type' | 'size'> & {
	label?: ReactNode
	info?: ReactNode
	error?: ReactNode
}

export const Radio = ({
	label,
	info,
	error,
	className,
	id,
	'aria-describedby': ariaDescribedBy,
	...props
}: RadioProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId
	const messageId = `${inputId}-message`
	const message = error || info

	const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ')

	const box = (
		<span className="relative mt-px grid size-5 shrink-0 place-items-center">
			<input
				id={inputId}
				type="radio"
				aria-describedby={describedBy || undefined}
				className={cn(
					'peer border-muted-foreground/70 bg-background absolute inset-0 size-5 cursor-pointer appearance-none rounded-full border shadow-xs transition-[background-color,border-color,scale] duration-150 ease-out-strong outline-none hover:border-muted-foreground checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed motion-safe:active:scale-90',
					error && 'border-destructive',
					className,
				)}
				{...props}
			/>
			<span
				aria-hidden="true"
				className="bg-primary-foreground pointer-events-none size-2 scale-50 rounded-full opacity-0 transition-[opacity,scale] duration-150 ease-out-strong peer-checked:scale-100 peer-checked:opacity-100"
			/>
		</span>
	)

	return (
		<div className="flex flex-col gap-1.5">
			{label ? (
				<label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug has-disabled:cursor-not-allowed has-disabled:opacity-50">
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
