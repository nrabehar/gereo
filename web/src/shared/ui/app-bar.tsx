import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type AppBarProps = {
	children: ReactNode
	panel?: ReactNode
	notice?: ReactNode
	contentId?: string
	className?: string
}

export const AppBar = ({ children, panel, notice, contentId = 'main', className }: AppBarProps) => (
	<>
		<a
			href={`#${contentId}`}
			className="bg-foreground text-background focus-visible:outline-primary fixed start-3 top-3 z-50 -translate-y-[200%] rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2"
		>
			Skip to content
		</a>
		<header
			data-app-bar=""
			className={cn(
				'bg-background text-foreground short:relative sticky top-0 z-40 pt-[env(safe-area-inset-top)]',
				className,
			)}
		>
			<div className="mx-auto flex min-h-14 w-full max-w-6xl items-center gap-2 px-4 md:min-h-16 md:gap-3 md:px-6">
				{children}
			</div>
			{panel}
			<div aria-live="polite" aria-atomic="true">
				{notice}
			</div>
			<span
				aria-hidden="true"
				className="bg-border reveal-on-scroll pointer-events-none absolute inset-x-0 bottom-0 h-px"
			/>
		</header>
	</>
)

type AppBarActionBadge = {
	count?: number
	label: string
}

type AppBarActionProps = Omit<useRender.ComponentProps<'button'>, 'children'> & {
	icon: LucideIcon
	label: string
	badge?: AppBarActionBadge
}

const formatBadgeCount = (count: number) => (count > 99 ? '99+' : String(count))

const badgeMotion =
	'ease-out-strong transition-[scale,opacity] duration-200 motion-reduce:transition-none starting:scale-75 starting:opacity-0'

const AppBarBadge = ({ count }: { count?: number }) =>
	count !== undefined && count > 0 ? (
		<span
			aria-hidden="true"
			className={cn(
				'bg-primary text-primary-foreground ring-background absolute inset-s-[calc(50%+0.125rem)] -top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full px-1 text-[0.6875rem] leading-none font-semibold tabular-nums ring-2 md:hidden',
				badgeMotion,
			)}
		>
			{formatBadgeCount(count)}
		</span>
	) : (
		<span
			aria-hidden="true"
			className={cn(
				'bg-primary ring-background absolute inset-s-[calc(50%+0.25rem)] -top-0.5 size-2.5 rounded-full ring-2',
				badgeMotion,
			)}
		/>
	)

const AppBarInlineCount = ({ count }: { count?: number }) =>
	count !== undefined && count > 0 ? (
		<span
			aria-hidden="true"
			className={cn(
				'bg-primary text-primary-foreground grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs leading-none font-semibold tabular-nums max-md:hidden',
				badgeMotion,
			)}
		>
			{formatBadgeCount(count)}
		</span>
	) : null

export const AppBarAction = ({
	icon: Icon,
	label,
	badge,
	render,
	ref,
	className,
	...props
}: AppBarActionProps) =>
	useRender({
		defaultTagName: 'button',
		render,
		ref,
		props: mergeProps<'button'>(
			{
				type: render ? undefined : 'button',
				className: cn(
					'group text-muted-foreground hover:text-foreground focus-visible:outline-foreground data-[status=active]:text-foreground aria-expanded:text-foreground ease-out-strong relative inline-flex min-h-12 min-w-12 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-xs leading-4 font-medium whitespace-nowrap transition-[color,background-color,scale] duration-150 select-none focus-visible:outline-2 focus-visible:-outline-offset-2 motion-safe:active:scale-[0.97] md:min-h-10 md:flex-row md:gap-2 md:rounded-full md:px-3.5 md:text-sm md:not-data-[status=active]:hover:bg-muted md:data-[status=active]:bg-primary/20 md:pointer-coarse:min-h-12',
					className,
				),
				children: (
					<>
						<span className="group-data-[status=active]:bg-primary/20 group-aria-expanded:bg-primary/20 ease-out-strong relative grid h-7 w-11 place-items-center rounded-full transition-[background-color] duration-200 md:size-4 md:group-data-[status=active]:bg-transparent">
							<Icon aria-hidden="true" className="size-5 md:size-4" />
							{badge && <AppBarBadge count={badge.count} />}
						</span>
						<span>
							{label}
							{badge && <span className="sr-only">, {badge.label}</span>}
						</span>
						{badge && <AppBarInlineCount count={badge.count} />}
					</>
				),
			},
			props,
		),
	})
