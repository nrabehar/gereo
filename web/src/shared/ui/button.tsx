import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '$/cn'

const buttonVariants = cva(
	'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-semibold [&_svg]:pointer-events-none [&_svg]:shrink-0 whitespace-nowrap select-none transition-[color,background-color,box-shadow,scale,opacity] duration-150 ease-out-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground motion-safe:not-aria-busy:active:scale-[0.97] disabled:not-aria-busy:pointer-events-none disabled:not-aria-busy:opacity-50 aria-busy:cursor-progress aria-busy:opacity-70',
	{
		variants: {
			variant: {
				primary:
					'bg-primary text-primary-foreground not-aria-busy:hover:brightness-95 not-aria-busy:active:brightness-90',
				destructive:
					'bg-destructive text-destructive-foreground not-aria-busy:hover:brightness-95 not-aria-busy:active:brightness-90',
				secondary:
					'bg-secondary text-secondary-foreground not-aria-busy:hover:brightness-95 not-aria-busy:active:brightness-90',
				ghost: 'text-foreground not-aria-busy:hover:bg-muted not-aria-busy:active:bg-accent',
				outline:
					'text-foreground ring-2 ring-foreground ring-inset not-aria-busy:hover:bg-foreground not-aria-busy:hover:text-background not-aria-busy:active:opacity-80',
				link: 'text-foreground underline underline-offset-4 not-aria-busy:hover:no-underline not-aria-busy:active:opacity-70',
			},
			size: {
				sm: 'h-8 rounded-full px-4 text-xs [&_svg:not([class*=size-])]:size-3.5',
				md: 'h-10 rounded-full px-5 text-sm [&_svg:not([class*=size-])]:size-4',
				lg: 'h-12 rounded-full px-7 text-base [&_svg:not([class*=size-])]:size-5',
				'icon-sm': 'size-8 rounded-full text-xs [&_svg:not([class*=size-])]:size-3.5',
				icon: 'size-10 rounded-full text-sm [&_svg:not([class*=size-])]:size-4',
				'icon-lg': 'size-12 rounded-full text-base [&_svg:not([class*=size-])]:size-5',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
)

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
