import type { ComponentProps } from 'react'

import { cn } from '$/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'bg-surface-2 text-fg ring-1 ring-border ring-inset hover:bg-surface-3 focus-visible:outline-brand-600',
  ghost: 'text-fg hover:bg-surface-2 focus-visible:outline-brand-600',
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
}

export const Button = ({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...props}
  />
)
