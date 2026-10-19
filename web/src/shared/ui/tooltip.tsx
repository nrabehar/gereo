import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import type { ReactElement, ReactNode } from 'react'

type TooltipProps = {
	content: ReactNode
	children: ReactElement
	side?: 'top' | 'right' | 'bottom' | 'left'
}

export const TooltipProvider = ({ children }: { children: ReactNode }) => (
	<BaseTooltip.Provider delay={400} closeDelay={0}>
		{children}
	</BaseTooltip.Provider>
)

export const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => (
	<BaseTooltip.Root>
		<BaseTooltip.Trigger render={children} />
		<BaseTooltip.Portal>
			<BaseTooltip.Positioner side={side} sideOffset={8} className="z-50">
				<BaseTooltip.Popup className="bg-foreground text-background max-w-64 origin-(--transform-origin) rounded-lg px-2.5 py-1.5 text-xs leading-snug font-medium text-balance shadow-md transition-[scale,opacity] duration-150 ease-out-strong data-ending-style:scale-97 data-ending-style:opacity-0 data-ending-style:duration-100 data-instant:transition-none data-starting-style:scale-97 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100">
					{content}
				</BaseTooltip.Popup>
			</BaseTooltip.Positioner>
		</BaseTooltip.Portal>
	</BaseTooltip.Root>
)
