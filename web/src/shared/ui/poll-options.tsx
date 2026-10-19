import { CheckIcon } from 'lucide-react'
import { useId } from 'react'

import { cn } from '$/cn'

type PollOption = {
	id: string
	label: string
	votes: number
}

type PollOptionsProps = {
	options: PollOption[]
	value: string | null
	onValueChange: (id: string) => void
	showResults?: boolean
	closed?: boolean
	label: string
	locale?: string
	className?: string
}

export const PollOptions = ({
	options,
	value,
	onValueChange,
	showResults = false,
	closed = false,
	label,
	locale = 'fr-FR',
	className,
}: PollOptionsProps) => {
	const name = useId()
	const total = options.reduce((sum, option) => sum + option.votes, 0)
	const leader = Math.max(0, ...options.map((option) => option.votes))
	const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 })
	const count = new Intl.NumberFormat(locale)

	return (
		<fieldset disabled={closed} className={cn('flex min-w-0 flex-col gap-2', className)}>
			<legend className="mb-1.5 text-sm leading-snug font-medium">{label}</legend>
			{options.map((option) => {
				const share = total > 0 ? option.votes / total : 0
				const selected = value === option.id

				return (
					<label
						key={option.id}
						className={cn(
							'border-muted-foreground/70 bg-background hover:border-muted-foreground has-checked:border-primary has-focus-visible:outline-foreground relative isolate flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-sm shadow-xs transition-[border-color,scale] duration-150 ease-out-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-disabled:cursor-default has-disabled:hover:border-muted-foreground/70 motion-safe:active:scale-[0.99]',
						)}
					>
						<input
							type="radio"
							name={name}
							value={option.id}
							checked={selected}
							onChange={() => onValueChange(option.id)}
							className="sr-only"
						/>
						{showResults && (
							<span
								aria-hidden="true"
								className={cn(
									'absolute inset-y-0 start-0 -z-10 transition-[width] duration-500 ease-out-strong motion-reduce:transition-none',
									option.votes === leader && leader > 0
										? 'bg-primary/25'
										: 'bg-muted',
								)}
								style={{ width: `${share * 100}%` }}
							/>
						)}
						<span className="flex-1 leading-snug">{option.label}</span>
						{selected && (
							<CheckIcon
								aria-hidden="true"
								className="size-4 shrink-0"
								strokeWidth={3}
							/>
						)}
						{showResults && (
							<span className="text-muted-foreground text-xs tabular-nums">
								{count.format(option.votes)} · {percent.format(share)}
							</span>
						)}
					</label>
				)
			})}
		</fieldset>
	)
}
