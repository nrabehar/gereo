import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type SidebarItem = {
	id: string
	label: string
	icon?: LucideIcon
	to: LinkProps['to']
	hash?: string
	exact?: boolean
	badge?: ReactNode
}

type SidebarSection = {
	title?: string
	items: SidebarItem[]
}

type SidebarProps = {
	sections: SidebarSection[]
	header?: ReactNode
	footer?: ReactNode
	className?: string
}

export const Sidebar = ({ sections, header, footer, className }: SidebarProps) => (
	<aside
		className={cn(
			'bg-sidebar text-sidebar-foreground border-sidebar-border flex h-full w-64 shrink-0 flex-col gap-4 border-e p-3',
			className,
		)}
	>
		{header && <div className="px-2 pt-1">{header}</div>}
		<nav aria-label="Main" className="flex flex-1 flex-col gap-5 overflow-y-auto">
			{sections.map((section, index) => (
				<div key={section.title ?? index} className="flex flex-col gap-1">
					{section.title && (
						<p className="text-muted-foreground px-3 pb-1 text-xs font-medium tracking-[0.06em] uppercase">
							{section.title}
						</p>
					)}
					<ul className="flex flex-col gap-0.5">
						{section.items.map((item) => {
							const Icon = item.icon

							return (
								<li key={item.id}>
									<Link
										to={item.to}
										hash={item.hash}
										activeOptions={{
											exact: item.exact ?? item.hash !== undefined,
											includeHash: item.hash !== undefined,
										}}
										className="text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent active:bg-sidebar-accent/70 focus-visible:outline-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-[color,background-color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 focus-visible:-outline-offset-2 motion-safe:active:scale-[0.98]"
									>
										{Icon && (
											<Icon aria-hidden="true" className="size-4 shrink-0" />
										)}
										<span className="flex-1 truncate">{item.label}</span>
										{item.badge}
									</Link>
								</li>
							)
						})}
					</ul>
				</div>
			))}
		</nav>
		{footer && <div className="border-sidebar-border border-t px-2 pt-3">{footer}</div>}
	</aside>
)
