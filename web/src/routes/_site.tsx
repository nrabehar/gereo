import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SiteHeader } from '@/app/shell/site-header'

const SiteLayout = () => (
	<div className="flex min-h-dvh flex-col">
		<SiteHeader />
		<main id="main" tabIndex={-1} className="flex-1 outline-none">
			<Outlet />
		</main>
	</div>
)

export const Route = createFileRoute('/_site')({
	component: SiteLayout,
})
