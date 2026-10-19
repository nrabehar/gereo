import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { CheckIcon, ChevronDownIcon, CircleAlertIcon, XIcon } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type ComboboxOption = {
	value: string
	label: string
	disabled?: boolean
}

const inputVariants = cva(
	'border-muted-foreground/70 bg-background text-foreground placeholder:text-muted-foreground w-full min-w-0 border shadow-xs transition-[border-color,box-shadow,background-color] duration-150 ease-out-strong outline-none selection:bg-primary/30 hover:border-muted-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-foreground/10 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-muted-foreground/70',
	{
		variants: {
			size: {
				sm: 'h-8 rounded-md ps-3 text-xs max-sm:text-base',
				md: 'h-10 rounded-lg ps-3.5 text-sm max-sm:text-base',
				lg: 'h-12 rounded-xl ps-4 text-base',
			},
			clearable: { true: '', false: '' },
		},
		compoundVariants: [
			{ size: 'sm', clearable: false, class: 'pe-9' },
			{ size: 'md', clearable: false, class: 'pe-10' },
			{ size: 'lg', clearable: false, class: 'pe-12' },
			{ size: 'sm', clearable: true, class: 'pe-14' },
			{ size: 'md', clearable: true, class: 'pe-[4.5rem]' },
			{ size: 'lg', clearable: true, class: 'pe-22' },
		],
		defaultVariants: {
			size: 'md',
			clearable: false,
		},
	},
)

type ComboboxSize = NonNullable<VariantProps<typeof inputVariants>['size']>

const actionSizes: Record<ComboboxSize, string> = {
	sm: 'size-6 rounded-sm [&_svg]:size-3.5',
	md: 'size-8 rounded-md [&_svg]:size-4',
	lg: 'size-10 rounded-lg [&_svg]:size-5',
}

const actionClassName =
	'text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent focus-visible:outline-foreground grid cursor-pointer place-items-center transition-[color,background-color,scale] duration-150 ease-out-strong select-none after:absolute after:-inset-1 focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-95'

type ComboboxProps = {
	items: ComboboxOption[]
	value?: string | null
	defaultValue?: string | null
	onValueChange?: (value: string | null) => void
	label?: string
	info?: ReactNode
	error?: ReactNode
	placeholder?: string
	emptyText?: string
	size?: ComboboxSize
	name?: string
	id?: string
	required?: boolean
	disabled?: boolean
	clearable?: boolean
	className?: string
	'aria-label'?: string
}

const findOption = (items: ComboboxOption[], value: string | null | undefined) =>
	items.find((item) => item.value === value) ?? null

export const Combobox = ({
	items,
	value,
	defaultValue,
	onValueChange,
	label,
	info,
	error,
	placeholder,
	emptyText = 'No results found.',
	size = 'md',
	name,
	id,
	required,
	disabled,
	clearable = false,
	className,
	'aria-label': ariaLabel,
}: ComboboxProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId
	const messageId = `${inputId}-message`
	const message = error || info

	const selection =
		value !== undefined
			? { value: findOption(items, value) }
			: { defaultValue: findOption(items, defaultValue) }

	const field = (
		<BaseCombobox.Root<ComboboxOption>
			items={items}
			name={name}
			required={required}
			disabled={disabled}
			autoHighlight
			itemToStringLabel={(item) => item.label}
			itemToStringValue={(item) => item.value}
			isItemEqualToValue={(item, selected) => item.value === selected.value}
			onValueChange={(option) => onValueChange?.(option?.value ?? null)}
			{...selection}
		>
			<BaseCombobox.InputGroup className="relative">
				<BaseCombobox.Input
					id={inputId}
					placeholder={placeholder}
					aria-label={ariaLabel}
					aria-invalid={error ? true : undefined}
					aria-describedby={message ? messageId : undefined}
					className={cn(inputVariants({ size, clearable }), className)}
				/>
				<div
					className={cn(
						'absolute inset-y-0 end-1 flex items-center',
						size === 'sm' ? 'gap-0' : 'gap-0.5',
					)}
				>
					{clearable && (
						<BaseCombobox.Clear
							aria-label="Clear"
							className={cn(
								'relative',
								actionClassName,
								actionSizes[size],
								'data-starting-style:scale-90 data-starting-style:opacity-0 data-ending-style:scale-90 data-ending-style:opacity-0',
							)}
						>
							<XIcon aria-hidden="true" />
						</BaseCombobox.Clear>
					)}
					<BaseCombobox.Trigger
						aria-label="Open options"
						className={cn('relative', actionClassName, actionSizes[size])}
					>
						<ChevronDownIcon aria-hidden="true" />
					</BaseCombobox.Trigger>
				</div>
			</BaseCombobox.InputGroup>
			<BaseCombobox.Portal>
				<BaseCombobox.Positioner sideOffset={6} className="z-50 outline-none">
					<BaseCombobox.Popup className="border-border bg-background text-foreground w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-xl border p-1 shadow-lg transition-[scale,opacity] duration-150 ease-out-strong data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100">
						<BaseCombobox.Empty className="text-muted-foreground px-3 py-6 text-center text-sm empty:hidden">
							{emptyText}
						</BaseCombobox.Empty>
						<BaseCombobox.List className="max-h-[min(18rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain outline-none data-empty:hidden">
							{(item: ComboboxOption) => (
								<BaseCombobox.Item
									key={item.value}
									value={item}
									disabled={item.disabled}
									className="data-highlighted:bg-muted grid cursor-pointer grid-cols-[1rem_1fr] items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50"
								>
									<BaseCombobox.ItemIndicator className="col-start-1">
										<CheckIcon aria-hidden="true" className="size-4" />
									</BaseCombobox.ItemIndicator>
									<span className="col-start-2 truncate">{item.label}</span>
								</BaseCombobox.Item>
							)}
						</BaseCombobox.List>
					</BaseCombobox.Popup>
				</BaseCombobox.Positioner>
			</BaseCombobox.Portal>
		</BaseCombobox.Root>
	)

	if (!label && !message) {
		return field
	}

	return (
		<div className="flex flex-col gap-1.5">
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
