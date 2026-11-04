import type { VariantProps } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '$/cn'

import { buttonVariants } from './button-variants'

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>
type IconButtonSize = Extract<ButtonSize, `icon${string}`>
type TextButtonSize = Exclude<ButtonSize, IconButtonSize>

type AccessibleName = { 'aria-label': string } | { 'aria-labelledby': string }

type ButtonProps = ComponentProps<'button'> &
	Pick<VariantProps<typeof buttonVariants>, 'variant'> & {
		loading?: boolean
	} & ({ size?: TextButtonSize | null } | ({ size: IconButtonSize } & AccessibleName))

export const Button = ({
	variant,
	size,
	loading = false,
	className,
	type = 'button',
	children,
	disabled,
	...props
}: ButtonProps) => (
	<button
		type={type}
		aria-busy={loading || undefined}
		disabled={disabled || loading}
		className={cn(buttonVariants({ variant, size }), className)}
		{...props}
	>
		{loading && (
			<LoaderCircleIcon
				aria-hidden="true"
				className="size-[1.1em] animate-[spin_700ms_linear_infinite] motion-reduce:animate-pulse"
			/>
		)}
		{children}
	</button>
)
