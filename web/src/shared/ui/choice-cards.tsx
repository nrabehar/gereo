import { CircleAlertIcon } from 'lucide-react'
import { useId, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type ChoiceCardItem = {
	value: string
	label: string
	description?: ReactNode
	icon?: LucideIcon
	disabled?: boolean
}

type ChoiceCardsProps = {
	items: ChoiceCardItem[]
	name: string
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	label?: string
	info?: ReactNode
	error?: ReactNode
	columns?: 1 | 2 | 3
	required?: boolean
	disabled?: boolean
	className?: string
}

const columnClasses = {
	1: 'grid-cols-1',
	2: 'grid-cols-1 sm:grid-cols-2',
	3: 'grid-cols-1 sm:grid-cols-3',
}

export const ChoiceCards = ({
	items,
	name,
	value,
	defaultValue,
	onValueChange,
	label,
	info,
	error,
	columns = 2,
	required,
	disabled,
	className,
}: ChoiceCardsProps) => {
	const generatedId = useId()
	const messageId = `${generatedId}-message`
	const message = error || info
	const [internal, setInternal] = useState(defaultValue ?? '')
	const selected = value === undefined ? internal : value

	return (
		<fieldset
			disabled={disabled}
			aria-describedby={message ? messageId : undefined}
			className={cn('flex min-w-0 flex-col gap-2', className)}
		>
			{label && (
				<legend className="mb-1.5 text-sm leading-none font-medium">
					{label}
					{required && (
						<span
							aria-hidden="true"
							className="text-destructive ml-0.5 dark:text-red-400"
						>
							*
						</span>
					)}
				</legend>
			)}
			<div className={cn('grid gap-2', columnClasses[columns])}>
				{items.map((item) => {
					const Icon = item.icon

					return (
						<label
							key={item.value}
							className={cn(
								'border-muted-foreground/70 bg-background hover:border-muted-foreground has-checked:border-primary has-checked:bg-primary/10 has-focus-visible:outline-foreground flex cursor-pointer items-start gap-3 rounded-xl border p-4 shadow-xs transition-[border-color,background-color,scale] duration-150 ease-out-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:hover:border-muted-foreground/70 motion-safe:active:scale-[0.99]',
								error && 'border-destructive',
							)}
						>
							<input
								type="radio"
								name={name}
								value={item.value}
								checked={selected === item.value}
								disabled={item.disabled}
								required={required}
								onChange={() => {
									setInternal(item.value)
									onValueChange?.(item.value)
								}}
								className="peer sr-only"
							/>
							{Icon && (
								<Icon
									aria-hidden="true"
									className="text-muted-foreground mt-0.5 size-5 shrink-0"
								/>
							)}
							<span className="flex min-w-0 flex-1 flex-col gap-0.5">
								<span className="text-sm leading-snug font-medium">
									{item.label}
								</span>
								{item.description && (
									<span className="text-muted-foreground text-xs text-pretty">
										{item.description}
									</span>
								)}
							</span>
							<span
								aria-hidden="true"
								className="border-muted-foreground/70 peer-checked:border-primary peer-checked:bg-primary mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-[background-color,border-color] duration-150 ease-out-strong"
							>
								<span className="bg-primary-foreground size-2 scale-50 rounded-full opacity-0 transition-[opacity,scale] duration-150 ease-out-strong peer-checked:scale-100 peer-checked:opacity-100" />
							</span>
						</label>
					)
				})}
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
		</fieldset>
	)
}
