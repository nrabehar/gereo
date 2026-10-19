import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '$/cn'

const buttonVariants = cva(
	'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0 whitespace-nowrap select-none transition-[color,background-color,box-shadow,scale,opacity] duration-150 ease-out-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground motion-safe:not-aria-busy:active:scale-[0.97] disabled:not-aria-busy:pointer-events-none disabled:not-aria-busy:opacity-50 aria-busy:cursor-progress aria-busy:opacity-70',
	{
		variants: {
			variant: {
				primary:
					'bg-primary text-primary-foreground shadow-xs inset-shadow-2xs inset-shadow-white/40 not-aria-busy:hover:bg-primary/90 not-aria-busy:hover:shadow-sm not-aria-busy:active:bg-primary/80 not-aria-busy:active:shadow-none',
				destructive:
					'bg-destructive text-destructive-foreground shadow-xs inset-shadow-2xs inset-shadow-white/30 not-aria-busy:hover:bg-destructive/90 not-aria-busy:hover:shadow-sm not-aria-busy:active:bg-destructive/80 not-aria-busy:active:shadow-none',
				secondary:
					'bg-muted text-foreground ring-1 ring-border ring-inset not-aria-busy:hover:bg-accent not-aria-busy:active:bg-accent/70',
				ghost: 'text-foreground not-aria-busy:hover:bg-muted not-aria-busy:active:bg-accent',
				outline:
					'text-foreground ring-1 ring-border ring-inset not-aria-busy:hover:bg-muted not-aria-busy:active:bg-accent',
				link: 'text-foreground underline underline-offset-4 not-aria-busy:hover:no-underline not-aria-busy:active:opacity-70',
			},
			size: {
				sm: 'h-8 rounded-md px-3 text-xs [&_svg:not([class*=size-])]:size-3.5',
				md: 'h-10 rounded-lg px-4 text-sm [&_svg:not([class*=size-])]:size-4',
				lg: 'h-12 rounded-xl px-6 text-base [&_svg:not([class*=size-])]:size-5',
				'icon-sm': 'size-8 rounded-md text-xs [&_svg:not([class*=size-])]:size-3.5',
				icon: 'size-10 rounded-lg text-sm [&_svg:not([class*=size-])]:size-4',
				'icon-lg': 'size-12 rounded-xl text-base [&_svg:not([class*=size-])]:size-5',
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
