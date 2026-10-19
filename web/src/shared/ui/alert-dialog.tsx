import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import type { ReactElement, ReactNode } from 'react'

import { Button } from '@ui/button'

type AlertDialogProps = {
	trigger?: ReactElement
	title: string
	description?: ReactNode
	confirmLabel?: string
	cancelLabel?: string
	destructive?: boolean
	onConfirm?: () => void
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
}

export const AlertDialog = ({
	trigger,
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	destructive = true,
	onConfirm,
	open,
	defaultOpen,
	onOpenChange,
}: AlertDialogProps) => (
	<BaseAlertDialog.Root
		open={open}
		defaultOpen={defaultOpen}
		onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
	>
		{trigger && <BaseAlertDialog.Trigger render={trigger} />}
		<BaseAlertDialog.Portal>
			<BaseAlertDialog.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black/50 transition-opacity duration-200 ease-out-strong data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:opacity-0" />
			<BaseAlertDialog.Popup className="bg-background text-foreground border-border fixed top-1/2 left-1/2 z-50 flex w-md max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl border p-6 shadow-xl transition-[scale,opacity] duration-200 ease-out-strong outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100">
				<div className="flex flex-col gap-1.5">
					<BaseAlertDialog.Title className="font-heading text-lg leading-tight font-semibold tracking-[-0.01em]">
						{title}
					</BaseAlertDialog.Title>
					{description && (
						<BaseAlertDialog.Description className="text-muted-foreground text-sm text-pretty">
							{description}
						</BaseAlertDialog.Description>
					)}
				</div>
				<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<BaseAlertDialog.Close render={<Button variant="outline" />}>
						{cancelLabel}
					</BaseAlertDialog.Close>
					<BaseAlertDialog.Close
						render={<Button variant={destructive ? 'destructive' : 'primary'} />}
						onClick={onConfirm}
					>
						{confirmLabel}
					</BaseAlertDialog.Close>
				</div>
			</BaseAlertDialog.Popup>
		</BaseAlertDialog.Portal>
	</BaseAlertDialog.Root>
)
