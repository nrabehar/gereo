import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { CircleAlertIcon } from 'lucide-react'
import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '$/cn'

const textareaVariants = cva(
	'border-muted-foreground/70 bg-background text-foreground placeholder:text-muted-foreground field-sizing-content w-full min-w-0 resize-y border shadow-xs transition-[border-color,box-shadow,background-color] duration-150 ease-out-strong outline-none selection:bg-primary/30 hover:border-muted-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-foreground/10 read-only:bg-muted aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-muted-foreground/70',
	{
		variants: {
			size: {
				sm: 'min-h-16 rounded-md px-3 py-2 text-xs max-sm:text-base',
				md: 'min-h-20 rounded-lg px-3.5 py-2.5 text-sm max-sm:text-base',
				lg: 'min-h-28 rounded-xl px-4 py-3 text-base',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)

type TextareaProps = ComponentProps<'textarea'> &
	VariantProps<typeof textareaVariants> & {
		label?: string
		info?: ReactNode
		error?: ReactNode
	}

export const Textarea = ({
	size,
	label,
	info,
	error,
	className,
	id,
	required,
	'aria-invalid': ariaInvalid,
	'aria-describedby': ariaDescribedBy,
	...props
}: TextareaProps) => {
	const generatedId = useId()
	const textareaId = id ?? generatedId
	const messageId = `${textareaId}-message`
	const message = error || info

	const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ')

	const field = (
		<textarea
			id={textareaId}
			required={required}
			aria-invalid={error ? true : ariaInvalid}
			aria-describedby={describedBy || undefined}
			className={cn(textareaVariants({ size }), className)}
			{...props}
		/>
	)

	if (!label && !message) {
		return field
	}

	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label htmlFor={textareaId} className="text-sm leading-none font-medium">
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
