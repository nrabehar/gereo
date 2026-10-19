import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'

import { cn } from '$/cn'

type BreadcrumbItem = {
	label: string
	to?: LinkProps['to']
}

type BreadcrumbProps = {
	items: BreadcrumbItem[]
	className?: string
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => (
	<nav aria-label="Breadcrumb" className={className}>
		<ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
			{items.map((item, index) => {
				const isLast = index === items.length - 1

				return (
					<li key={item.label} className="flex items-center gap-1.5">
						{item.to && !isLast ? (
							<Link
								to={item.to}
								className="hover:text-foreground focus-visible:outline-foreground rounded-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
							>
								{item.label}
							</Link>
						) : (
							<span
								aria-current={isLast ? 'page' : undefined}
								className={cn(isLast && 'text-foreground font-medium')}
							>
								{item.label}
							</span>
						)}
						{!isLast && <ChevronRightIcon aria-hidden="true" className="size-3.5" />}
					</li>
				)
			})}
		</ol>
	</nav>
)
