import { CircleAlertIcon, XIcon } from 'lucide-react'
import { useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cn } from '$/cn'

type TagInputProps = {
	value?: string[]
	defaultValue?: string[]
	onValueChange?: (value: string[]) => void
	label?: string
	info?: ReactNode
	error?: ReactNode
	placeholder?: string
	max?: number
	disabled?: boolean
	required?: boolean
	id?: string
	className?: string
	'aria-label'?: string
}

export const TagInput = ({
	value,
	defaultValue = [],
	onValueChange,
	label,
	info,
	error,
	placeholder,
	max,
	disabled,
	required,
	id,
	className,
	'aria-label': ariaLabel,
}: TagInputProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId
	const messageId = `${inputId}-message`
	const message = error || info
	const [internal, setInternal] = useState(defaultValue)
	const [draft, setDraft] = useState('')
	const tags = value === undefined ? internal : value
	const full = max !== undefined && tags.length >= max

	const commit = (next: string[]) => {
		setInternal(next)
		onValueChange?.(next)
	}

	const addDraft = () => {
		const tag = draft.trim()

		if (tag && !full && !tags.includes(tag)) {
			commit([...tags, tag])
		}

		setDraft('')
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault()
			addDraft()
		} else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
			commit(tags.slice(0, -1))
		}
	}

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			{label && (
				<label htmlFor={inputId} className="text-sm leading-none font-medium">
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
			<div
				className={cn(
					'border-muted-foreground/70 bg-background hover:border-muted-foreground has-focus-visible:border-foreground has-focus-visible:ring-foreground/10 flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border p-1.5 shadow-xs transition-[border-color,box-shadow] duration-150 ease-out-strong has-focus-visible:ring-[3px]',
					error &&
						'border-destructive has-focus-visible:border-destructive has-focus-visible:ring-destructive/20',
					disabled && 'cursor-not-allowed opacity-50',
				)}
			>
				{tags.map((tag) => (
					<span
						key={tag}
						className="bg-muted ring-border inline-flex h-7 items-center gap-1 rounded-md ps-2.5 pe-1 text-sm ring-1 ring-inset"
					>
						{tag}
						<button
							type="button"
							aria-label={`Remove ${tag}`}
							disabled={disabled}
							onClick={() => commit(tags.filter((item) => item !== tag))}
							className="text-muted-foreground hover:text-foreground hover:bg-foreground/10 focus-visible:outline-foreground grid size-5 cursor-pointer place-items-center rounded-sm transition-colors duration-150 focus-visible:outline-2 disabled:cursor-not-allowed"
						>
							<XIcon aria-hidden="true" className="size-3.5" />
						</button>
					</span>
				))}
				<input
					id={inputId}
					value={draft}
					disabled={disabled || full}
					placeholder={tags.length === 0 ? placeholder : undefined}
					aria-label={label ? undefined : ariaLabel}
					aria-invalid={error ? true : undefined}
					aria-describedby={message ? messageId : undefined}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={addDraft}
					className="placeholder:text-muted-foreground min-w-24 flex-1 bg-transparent px-1.5 py-1 text-sm outline-none max-sm:text-base"
				/>
			</div>
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
