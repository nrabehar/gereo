import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AppHeader } from '@/app/shell/app-header'
import { destinations } from '@/app/shell/destinations'
import { BottomNav } from '@ui/bottom-nav'

const AppLayout = () => (
	<div data-shell="app" className="flex min-h-dvh flex-col">
		<AppHeader />
		<main
			id="main"
			tabIndex={-1}
			className="short:pb-10 mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] outline-none md:px-6 md:pt-10 md:pb-16"
		>
			<Outlet />
		</main>
		<BottomNav fixed items={destinations} className="short:static md:hidden" />
	</div>
)

export const Route = createFileRoute('/_app')({
	component: AppLayout,
})
