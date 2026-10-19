import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import { cn } from '$/cn'

type BottomNavItem = {
	id: string
	label: string
	icon: LucideIcon
	to: LinkProps['to']
	hash?: string
	exact?: boolean
}

type BottomNavProps = {
	items: BottomNavItem[]
	fixed?: boolean
	className?: string
}

export const BottomNav = ({ items, fixed = false, className }: BottomNavProps) => (
	<nav
		aria-label="Main"
		className={cn(
			'border-border bg-background/90 supports-[backdrop-filter]:bg-background/70 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl',
			fixed && 'fixed inset-x-0 bottom-0 z-40',
			className,
		)}
	>
		<ul className="mx-auto flex max-w-xl items-stretch">
			{items.map((item) => {
				const Icon = item.icon

				return (
					<li key={item.id} className="flex-1">
						<Link
							to={item.to}
							hash={item.hash}
							activeOptions={{
								exact: item.exact ?? item.hash !== undefined,
								includeHash: item.hash !== undefined,
							}}
							className="group text-muted-foreground hover:text-foreground focus-visible:outline-foreground data-[status=active]:text-foreground flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-[color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 focus-visible:-outline-offset-2 motion-safe:active:scale-95"
						>
							<span className="group-data-[status=active]:bg-primary/20 grid h-7 w-12 place-items-center rounded-full transition-[background-color] duration-200 ease-out-strong">
								<Icon aria-hidden="true" className="size-5" />
							</span>
							{item.label}
						</Link>
					</li>
				)
			})}
		</ul>
	</nav>
)
