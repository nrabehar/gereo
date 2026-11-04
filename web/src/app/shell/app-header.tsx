import { Link, useCanGoBack, useLocation, useMatches, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, BellIcon, CircleHelpIcon, WifiOffIcon } from 'lucide-react'

import { cn } from '$/cn'
import { useOnline } from '$/use-online'
import { env } from '$config/env'
import { AppBar, AppBarAction } from '@ui/app-bar'
import { Button } from '@ui/button'
import { Logo } from '@ui/logo'

import { accountDestination, destinations, primaryDestinations } from './destinations'

export type NotificationSummary = {
	count: number
	hasUnread: boolean
}

type AppHeaderProps = {
	notifications?: NotificationSummary
}

const rootPaths = new Set<string>(destinations.map((destination) => destination.to))

const notificationBadge = (summary?: NotificationSummary) => {
	if (summary && summary.count > 0) {
		const verb = summary.count === 1 ? 'needs' : 'need'
		return { count: summary.count, label: `${summary.count} ${verb} your attention` }
	}
	if (summary?.hasUnread) {
		return { label: 'new updates' }
	}
	return undefined
}

const BackButton = () => {
	const router = useRouter()
	const canGoBack = useCanGoBack()

	return (
		<Button
			variant="ghost"
			size="icon-lg"
			aria-label="Back"
			className="-ms-3 md:hidden"
			onClick={() => {
				if (canGoBack) {
					router.history.back()
				} else {
					void router.navigate({ to: '/home' })
				}
			}}
		>
			<ArrowLeftIcon />
		</Button>
	)
}

const ConnectionNotice = () => (
	<div className="bg-secondary text-secondary-foreground">
		<p className="ease-out-strong mx-auto flex max-w-6xl items-start gap-2.5 px-4 py-2.5 text-sm transition-opacity duration-200 md:px-6 starting:opacity-0">
			<WifiOffIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
			<span>
				<span className="font-semibold">No connection.</span> You can still read saved data.
				Connect again to send money.
			</span>
		</p>
	</div>
)

export const AppHeader = ({ notifications }: AppHeaderProps) => {
	const online = useOnline()
	const nested = useLocation({ select: (location) => !rootPaths.has(location.pathname) })
	const title = useMatches({
		select: (matches) => matches.findLast((match) => match.staticData.title)?.staticData.title,
	})

	return (
		<AppBar notice={online ? undefined : <ConnectionNotice />}>
			{nested && <BackButton />}
			<Link
				to="/home"
				aria-label={`${env.appName} home`}
				className={cn(
					'focus-visible:outline-foreground relative shrink-0 rounded-lg after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-4',
					title && 'max-md:hidden',
				)}
			>
				<Logo />
			</Link>
			{title && (
				<p className="font-heading min-w-0 truncate text-xl leading-tight font-semibold tracking-[-0.01em] md:hidden">
					{title}
				</p>
			)}
			<nav aria-label="Main" className="ms-3 max-md:hidden">
				<ul className="flex items-center gap-1">
					{primaryDestinations.map((destination) => (
						<li key={destination.id}>
							<AppBarAction
								icon={destination.icon}
								label={destination.label}
								render={<Link to={destination.to} />}
							/>
						</li>
					))}
				</ul>
			</nav>
			<div className="ms-auto flex items-center gap-1">
				<AppBarAction icon={CircleHelpIcon} label="Help" render={<Link to="/help" />} />
				<AppBarAction
					icon={BellIcon}
					label="Notifications"
					badge={notificationBadge(notifications)}
					render={<Link to="/notifications" />}
				/>
				<AppBarAction
					icon={accountDestination.icon}
					label={accountDestination.label}
					render={<Link to={accountDestination.to} />}
					className="max-md:hidden"
				/>
			</div>
		</AppBar>
	)
}
