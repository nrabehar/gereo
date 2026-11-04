import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from '@tanstack/react-router'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppHeader } from './app-header'
import type { NotificationSummary } from './app-header'

const renderHeaderAt = async (path: string, notifications?: NotificationSummary) => {
	const rootRoute = createRootRoute({
		component: () => (
			<>
				<AppHeader notifications={notifications} />
				<Outlet />
			</>
		),
	})
	const pages = ['/home', '/wallets', '/groups', '/me', '/help'].map((pagePath) =>
		createRoute({ getParentRoute: () => rootRoute, path: pagePath }),
	)
	const notificationsPage = createRoute({
		getParentRoute: () => rootRoute,
		path: '/notifications',
		staticData: { title: 'Notifications' },
	})
	const router = createRouter({
		routeTree: rootRoute.addChildren([...pages, notificationsPage]),
		history: createMemoryHistory({ initialEntries: [path] }),
	})

	await router.load()
	render(<RouterProvider router={router} />)
	await screen.findByRole('banner')
}

describe('AppHeader', () => {
	beforeEach(() => {
		vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('shows the brand and no back button on a main destination', async () => {
		await renderHeaderAt('/home')

		expect(screen.getByRole('link', { name: 'Gereo home' })).toBeDefined()
		expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
	})

	it('shows the page title and a back button on a page below a destination', async () => {
		await renderHeaderAt('/notifications')

		expect(screen.getByRole('button', { name: 'Back' })).toBeDefined()
		expect(screen.getByText('Notifications', { selector: 'p' })).toBeDefined()
	})

	it('keeps Help and Notifications in the bar with visible labels', async () => {
		await renderHeaderAt('/wallets', { count: 2, hasUnread: true })

		expect(screen.getByRole('link', { name: 'Help' })).toBeDefined()
		expect(
			screen.getByRole('link', { name: 'Notifications, 2 need your attention' }),
		).toBeDefined()
	})

	it('says when there is no connection and what still works', async () => {
		const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
		await renderHeaderAt('/home')

		expect(screen.getByText('No connection.')).toBeDefined()

		onLine.mockReturnValue(true)
		act(() => {
			window.dispatchEvent(new Event('online'))
		})
		expect(screen.queryByText('No connection.')).toBeNull()
	})
})
