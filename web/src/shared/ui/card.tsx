import type { ComponentProps, ReactNode } from 'react'

import { cn } from '$/cn'

type CardProps = Omit<ComponentProps<'section'>, 'title'> & {
	title?: ReactNode
	description?: ReactNode
	footer?: ReactNode
}

export const Card = ({ title, description, footer, className, children, ...props }: CardProps) => (
	<section
		className={cn(
			'bg-card text-card-foreground border-border flex flex-col gap-4 rounded-2xl border p-6 shadow-xs',
			className,
		)}
		{...props}
	>
		{(title || description) && (
			<header className="flex flex-col gap-1">
				{title && (
					<h3 className="font-heading text-base leading-tight font-semibold tracking-[-0.01em]">
						{title}
					</h3>
				)}
				{description && (
					<p className="text-muted-foreground text-sm text-pretty">{description}</p>
				)}
			</header>
		)}
		{children}
		{footer && <footer className="flex items-center gap-2 pt-2">{footer}</footer>}
	</section>
)
