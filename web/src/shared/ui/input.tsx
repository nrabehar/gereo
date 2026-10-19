import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { CircleAlertIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '$/cn'

const inputVariants = cva(
	'border-muted-foreground/70 bg-background text-foreground placeholder:text-muted-foreground w-full min-w-0 border shadow-xs transition-[border-color,box-shadow,background-color] duration-150 ease-out-strong outline-none selection:bg-primary/30 hover:border-muted-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-foreground/10 read-only:bg-muted aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-muted-foreground/70',
	{
		variants: {
			size: {
				sm: 'h-8 rounded-md px-3 text-xs max-sm:text-base',
				md: 'h-10 rounded-lg px-3.5 text-sm max-sm:text-base',
				lg: 'h-12 rounded-xl px-4 text-base',
			},
			hasStartIcon: { true: '' },
			hasEndIcon: { true: '' },
		},
		compoundVariants: [
			{ size: 'sm', hasStartIcon: true, class: 'ps-9' },
			{ size: 'md', hasStartIcon: true, class: 'ps-10' },
			{ size: 'lg', hasStartIcon: true, class: 'ps-12' },
			{ size: 'sm', hasEndIcon: true, class: 'pe-9' },
			{ size: 'md', hasEndIcon: true, class: 'pe-10' },
			{ size: 'lg', hasEndIcon: true, class: 'pe-12' },
		],
		defaultVariants: {
			size: 'md',
		},
	},
)

type InputSize = NonNullable<VariantProps<typeof inputVariants>['size']>

type InputIcon = { icon: LucideIcon; hidden?: boolean } & (
	{ onClick?: undefined; label?: undefined } | { onClick: () => void; label: string }
)

type InputProps = Omit<ComponentProps<'input'>, 'size'> &
	Pick<VariantProps<typeof inputVariants>, 'size'> & {
		label?: string
		info?: ReactNode
		error?: ReactNode
		startIcon?: InputIcon
		prefix?: string
		suffix?: string
		endIcon?: InputIcon
	}

const iconBoxSizes: Record<InputSize, string> = {
	sm: 'size-6 rounded-sm [&_svg]:size-3.5',
	md: 'size-8 rounded-md [&_svg]:size-4',
	lg: 'size-10 rounded-lg [&_svg]:size-5',
}

const InputAdornment = ({
	side,
	size,
	disabled,
	icon: Icon,
	hidden,
	onClick,
	label,
}: InputIcon & { side: 'start' | 'end'; size: InputSize; disabled?: boolean }) => {
	const position = cn(
		'absolute top-1/2 grid -translate-y-1/2 place-items-center',
		side === 'start' ? 'start-1' : 'end-1',
		iconBoxSizes[size],
		'transition-[color,background-color,scale,opacity,visibility] duration-150 ease-out-strong',
		hidden && 'invisible scale-90 opacity-0 motion-reduce:scale-100',
	)

	if (!onClick) {
		return (
			<span
				aria-hidden="true"
				className={cn(position, 'text-muted-foreground pointer-events-none')}
			>
				<Icon />
			</span>
		)
	}

	return (
		<button
			type="button"
			aria-label={label}
			disabled={disabled}
			onClick={onClick}
			className={cn(
				position,
				'after:absolute after:-inset-1 text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent focus-visible:outline-foreground cursor-pointer select-none focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-95',
			)}
		>
			<Icon aria-hidden="true" />
		</button>
	)
}

export const Input = ({
	size,
	label,
	info,
	error,
	startIcon,
	endIcon,
	prefix,
	suffix,
	style,
	disabled,
	className,
	type = 'text',
	id,
	required,
	'aria-invalid': ariaInvalid,
	'aria-describedby': ariaDescribedBy,
	...props
}: InputProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId
	const messageId = `${inputId}-message`
	const prefixId = `${inputId}-prefix`
	const suffixId = `${inputId}-suffix`
	const message = error || info
	const showSuffix = Boolean(suffix) && !endIcon
	const showPrefix = Boolean(prefix) && !startIcon

	const describedBy = [
		ariaDescribedBy,
		showPrefix ? prefixId : undefined,
		showSuffix ? suffixId : undefined,
		message ? messageId : undefined,
	]
		.filter(Boolean)
		.join(' ')

	const resolvedSize = size ?? 'md'

	const field = (
		<input
			id={inputId}
			type={type}
			required={required}
			disabled={disabled}
			aria-invalid={error ? true : ariaInvalid}
			aria-describedby={describedBy || undefined}
			className={cn(
				inputVariants({ size, hasStartIcon: !!startIcon, hasEndIcon: !!endIcon }),
				className,
			)}
			style={{
				paddingInlineStart: showPrefix
					? `calc(${prefix?.length ?? 0}ch + 1.35rem)`
					: undefined,
				paddingInlineEnd: showSuffix
					? `calc(${suffix?.length ?? 0}ch + 1.75rem)`
					: undefined,
				...style,
			}}
			{...props}
		/>
	)

	const input =
		startIcon || endIcon || showSuffix || showPrefix ? (
			<div className="relative">
				{startIcon && (
					<InputAdornment
						side="start"
						size={resolvedSize}
						disabled={disabled}
						{...startIcon}
					/>
				)}
				{showPrefix && (
					<span
						id={prefixId}
						className="text-muted-foreground pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-sm select-none"
					>
						{prefix}
					</span>
				)}
				{field}
				{showSuffix && (
					<span
						id={suffixId}
						className="text-muted-foreground pointer-events-none absolute inset-y-0 end-3.5 flex items-center text-sm select-none"
					>
						{suffix}
					</span>
				)}
				{endIcon && (
					<InputAdornment
						side="end"
						size={resolvedSize}
						disabled={disabled}
						{...endIcon}
					/>
				)}
			</div>
		) : (
			field
		)

	if (!label && !message) {
		return input
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
			{input}
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
