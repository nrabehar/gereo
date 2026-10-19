import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'

import { cn } from '$/cn'

type SheetSide = 'right' | 'left' | 'top' | 'bottom'

type SheetProps = {
	trigger?: ReactElement
	title: string
	description?: ReactNode
	children?: ReactNode
	footer?: ReactNode
	side?: SheetSide
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	className?: string
}

const sides: Record<SheetSide, string> = {
	right: 'inset-y-0 end-0 w-96 max-w-[calc(100vw-2rem)] rounded-s-2xl border-s data-ending-style:translate-x-full data-starting-style:translate-x-full rtl:data-ending-style:-translate-x-full rtl:data-starting-style:-translate-x-full',
	left: 'inset-y-0 start-0 w-96 max-w-[calc(100vw-2rem)] rounded-e-2xl border-e data-ending-style:-translate-x-full data-starting-style:-translate-x-full rtl:data-ending-style:translate-x-full rtl:data-starting-style:translate-x-full',
	top: 'inset-x-0 top-0 max-h-[85dvh] rounded-b-2xl border-b data-ending-style:-translate-y-full data-starting-style:-translate-y-full',
	bottom: 'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl border-t data-ending-style:translate-y-full data-starting-style:translate-y-full',
}

export const Sheet = ({
	trigger,
	title,
	description,
	children,
	footer,
	side = 'right',
	open,
	defaultOpen,
	onOpenChange,
	className,
}: SheetProps) => (
	<BaseDialog.Root
		open={open}
		defaultOpen={defaultOpen}
		onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
	>
		{trigger && <BaseDialog.Trigger render={trigger} />}
		<BaseDialog.Portal>
			<BaseDialog.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black/50 transition-opacity duration-300 ease-drawer data-ending-style:opacity-0 data-ending-style:duration-200 data-starting-style:opacity-0" />
			<BaseDialog.Popup
				className={cn(
					'bg-background text-foreground border-border fixed z-50 flex flex-col gap-4 overflow-y-auto p-6 shadow-xl transition-[translate] duration-300 ease-drawer outline-none data-ending-style:duration-200 motion-reduce:transition-none',
					sides[side],
					className,
				)}
			>
				<div className="flex flex-col gap-1.5 pe-8">
					<BaseDialog.Title className="font-heading text-lg leading-tight font-semibold tracking-[-0.01em]">
						{title}
					</BaseDialog.Title>
					{description && (
						<BaseDialog.Description className="text-muted-foreground text-sm text-pretty">
							{description}
						</BaseDialog.Description>
					)}
				</div>
				<div className="flex-1">{children}</div>
				{footer && (
					<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						{footer}
					</div>
				)}
				<BaseDialog.Close
					aria-label="Close"
					className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent focus-visible:outline-foreground absolute end-3 top-3 grid size-8 cursor-pointer place-items-center rounded-md transition-[color,background-color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 motion-safe:active:scale-95"
				>
					<XIcon aria-hidden="true" className="size-4" />
				</BaseDialog.Close>
			</BaseDialog.Popup>
		</BaseDialog.Portal>
	</BaseDialog.Root>
)
