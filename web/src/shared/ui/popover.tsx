import { Popover as BasePopover } from '@base-ui/react/popover'
import type { ReactElement, ReactNode } from 'react'

import { cn } from '$/cn'

type PopoverProps = {
	trigger: ReactElement
	title?: string
	description?: ReactNode
	children?: ReactNode
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
	className?: string
}

export const Popover = ({
	trigger,
	title,
	description,
	children,
	side = 'bottom',
	align = 'center',
	className,
}: PopoverProps) => (
	<BasePopover.Root>
		<BasePopover.Trigger render={trigger} />
		<BasePopover.Portal>
			<BasePopover.Positioner side={side} align={align} sideOffset={8} className="z-50">
				<BasePopover.Popup
					className={cn(
						'border-border bg-popover text-popover-foreground flex w-72 max-w-(--available-width) origin-(--transform-origin) flex-col gap-3 rounded-xl border p-4 shadow-lg outline-none transition-[scale,opacity] duration-150 ease-out-strong data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100',
						className,
					)}
				>
					{(title || description) && (
						<div className="flex flex-col gap-1">
							{title && (
								<BasePopover.Title className="font-heading text-sm font-semibold">
									{title}
								</BasePopover.Title>
							)}
							{description && (
								<BasePopover.Description className="text-muted-foreground text-sm text-pretty">
									{description}
								</BasePopover.Description>
							)}
						</div>
					)}
					{children}
				</BasePopover.Popup>
			</BasePopover.Positioner>
		</BasePopover.Portal>
	</BasePopover.Root>
)
