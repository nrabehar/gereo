import { useId, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '$/cn'

type SegmentedControlItem = {
	value: string
	label: string
	icon?: LucideIcon
	disabled?: boolean
}

type SegmentedControlProps = {
	items: SegmentedControlItem[]
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	label?: string
	name?: string
	disabled?: boolean
	className?: string
	'aria-label'?: string
}

export const SegmentedControl = ({
	items,
	value,
	defaultValue,
	onValueChange,
	label,
	name,
	disabled,
	className,
	'aria-label': ariaLabel,
}: SegmentedControlProps) => {
	const generatedName = useId()
	const [internal, setInternal] = useState(defaultValue ?? items[0]?.value ?? '')
	const selected = value === undefined ? internal : value
	const activeIndex = Math.max(
		0,
		items.findIndex((item) => item.value === selected),
	)

	return (
		<fieldset
			disabled={disabled}
			aria-label={label ? undefined : ariaLabel}
			className={cn('flex min-w-0 flex-col gap-1.5', className)}
		>
			{label && <legend className="mb-1.5 text-sm leading-none font-medium">{label}</legend>}
			<div
				className="bg-muted ring-border relative isolate grid w-full rounded-xl p-1 ring-1 ring-inset"
				style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
			>
				<span
					aria-hidden="true"
					className="bg-background dark:bg-accent absolute inset-y-1 start-1 -z-10 rounded-lg shadow-sm transition-transform duration-200 ease-in-out-strong motion-reduce:transition-none"
					style={{
						width: `calc((100% - 0.5rem) / ${items.length})`,
						transform: `translateX(${activeIndex * 100}%)`,
					}}
				/>
				{items.map((item) => {
					const Icon = item.icon

					return (
						<label
							key={item.value}
							className={cn(
								'has-focus-visible:outline-foreground flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-[color,scale] duration-150 ease-out-strong select-none has-focus-visible:outline-2 has-disabled:cursor-not-allowed has-disabled:opacity-50 motion-safe:active:scale-[0.97]',
								selected === item.value
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							<input
								type="radio"
								name={name ?? generatedName}
								value={item.value}
								checked={selected === item.value}
								disabled={item.disabled}
								onChange={() => {
									setInternal(item.value)
									onValueChange?.(item.value)
								}}
								className="sr-only"
							/>
							{Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
							{item.label}
						</label>
					)
				})}
			</div>
		</fieldset>
	)
}
