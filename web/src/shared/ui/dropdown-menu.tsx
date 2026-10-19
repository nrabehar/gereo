import { Menu } from '@base-ui/react/menu'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

import { cn } from '$/cn'

type DropdownMenuEntry =
	| {
			type?: 'item'
			label: string
			icon?: LucideIcon
			shortcut?: string
			destructive?: boolean
			disabled?: boolean
			onSelect?: () => void
	  }
	| { type: 'separator' }

type DropdownMenuProps = {
	trigger: ReactElement
	items: DropdownMenuEntry[]
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
}

export const DropdownMenu = ({
	trigger,
	items,
	side = 'bottom',
	align = 'start',
}: DropdownMenuProps) => (
	<Menu.Root>
		<Menu.Trigger render={trigger} />
		<Menu.Portal>
			<Menu.Positioner side={side} align={align} sideOffset={6} className="z-50 outline-none">
				<Menu.Popup className="border-border bg-popover text-popover-foreground min-w-48 origin-(--transform-origin) rounded-xl border p-1 shadow-lg outline-none transition-[scale,opacity] duration-150 ease-out-strong data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100">
					{items.map((entry, index) => {
						if (entry.type === 'separator') {
							return (
								<Menu.Separator
									key={`separator-${index}`}
									className="bg-border -mx-1 my-1 h-px"
								/>
							)
						}

						const Icon = entry.icon

						return (
							<Menu.Item
								key={entry.label}
								disabled={entry.disabled}
								onClick={entry.onSelect}
								className={cn(
									'data-highlighted:bg-muted flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
									entry.destructive && 'text-destructive dark:text-red-400',
								)}
							>
								{Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
								<span className="flex-1">{entry.label}</span>
								{entry.shortcut && (
									<span className="text-muted-foreground text-xs">
										{entry.shortcut}
									</span>
								)}
							</Menu.Item>
						)
					})}
				</Menu.Popup>
			</Menu.Positioner>
		</Menu.Portal>
	</Menu.Root>
)
