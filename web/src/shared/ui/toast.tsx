import { Toast as BaseToast } from '@base-ui/react/toast'
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, XIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '$/cn'

type ToastType = 'success' | 'error' | 'info'

const manager = BaseToast.createToastManager()

const add = (type: ToastType | undefined, title: string, description?: string) =>
	manager.add({ type, title, description })

export const toast = {
	show: (title: string, description?: string) => add(undefined, title, description),
	success: (title: string, description?: string) => add('success', title, description),
	error: (title: string, description?: string) => add('error', title, description),
	info: (title: string, description?: string) => add('info', title, description),
	dismiss: (id?: string) => manager.close(id),
}

const icons: Record<ToastType, { icon: LucideIcon; className: string }> = {
	success: { icon: CircleCheckIcon, className: 'text-emerald-600 dark:text-emerald-400' },
	error: { icon: CircleAlertIcon, className: 'text-destructive dark:text-red-400' },
	info: { icon: InfoIcon, className: 'text-muted-foreground' },
}

const ToastList = () => {
	const { toasts } = BaseToast.useToastManager()

	return toasts.map((item) => {
		const status =
			item.type === 'success' || item.type === 'error' || item.type === 'info'
				? icons[item.type]
				: undefined

		return (
			<BaseToast.Root
				key={item.id}
				toast={item}
				className="bg-popover text-popover-foreground border-border data-[type=success]:border-emerald-500/40 data-[type=success]:bg-[color-mix(in_oklab,var(--color-emerald-500)_12%,var(--popover))] data-[type=error]:border-destructive/40 data-[type=error]:bg-[color-mix(in_oklab,var(--destructive)_10%,var(--popover))] data-[type=info]:bg-muted [--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-(--height) w-full origin-bottom [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] rounded-xl border shadow-lg [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s] select-none after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-ending-style:opacity-0 data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-limited:opacity-0 data-starting-style:[transform:translateY(150%)] [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)] data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] motion-reduce:[transition:opacity_0.2s]"
			>
				<BaseToast.Content className="flex items-start gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-out-strong data-behind:opacity-0 data-expanded:opacity-100">
					{status && (
						<status.icon
							aria-hidden="true"
							className={cn('mt-0.5 size-4 shrink-0', status.className)}
						/>
					)}
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<BaseToast.Title className="text-sm leading-snug font-medium" />
						<BaseToast.Description className="text-muted-foreground text-sm leading-snug text-pretty" />
					</div>
					<BaseToast.Close
						aria-label="Dismiss"
						className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent focus-visible:outline-foreground -m-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-md transition-[color,background-color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 motion-safe:active:scale-95"
					>
						<XIcon aria-hidden="true" className="size-4" />
					</BaseToast.Close>
				</BaseToast.Content>
			</BaseToast.Root>
		)
	})
}

export const Toaster = () => (
	<BaseToast.Provider toastManager={manager}>
		<BaseToast.Portal>
			<BaseToast.Viewport className="fixed top-auto right-4 bottom-4 z-[60] mx-auto w-[calc(100vw-2rem)] sm:right-6 sm:bottom-6 sm:w-90">
				<ToastList />
			</BaseToast.Viewport>
		</BaseToast.Portal>
	</BaseToast.Provider>
)
