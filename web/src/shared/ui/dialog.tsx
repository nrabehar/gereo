import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'

import { cn } from '$/cn'

type DialogProps = {
	trigger?: ReactElement
	title: string
	description?: ReactNode
	children?: ReactNode
	footer?: ReactNode
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	className?: string
}

export const Dialog = ({
	trigger,
	title,
	description,
	children,
	footer,
	open,
	defaultOpen,
	onOpenChange,
	className,
}: DialogProps) => (
	<BaseDialog.Root
		open={open}
		defaultOpen={defaultOpen}
		onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
	>
		{trigger && <BaseDialog.Trigger render={trigger} />}
		<BaseDialog.Portal>
			<BaseDialog.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black/50 transition-opacity duration-200 ease-out-strong data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:opacity-0" />
			<BaseDialog.Popup
				className={cn(
					'bg-background text-foreground border-border fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-md max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-2xl border p-6 shadow-xl transition-[scale,opacity] duration-200 ease-out-strong outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100',
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
				{children}
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
