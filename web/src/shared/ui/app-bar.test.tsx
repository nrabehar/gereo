import { render, screen } from '@testing-library/react'
import { BellIcon } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { AppBarAction } from './app-bar'

describe('AppBarAction', () => {
	it('keeps the label visible and adds the badge to the accessible name', () => {
		render(
			<AppBarAction
				icon={BellIcon}
				label="Notifications"
				badge={{ count: 3, label: '3 need your attention' }}
			/>,
		)

		const action = screen.getByRole('button', { name: 'Notifications, 3 need your attention' })
		const counts = screen.getAllByText('3')

		expect(action.getAttribute('type')).toBe('button')
		expect(counts).toHaveLength(2)
		expect(counts.every((count) => count.getAttribute('aria-hidden') === 'true')).toBe(true)
	})

	it('caps large counts', () => {
		render(
			<AppBarAction
				icon={BellIcon}
				label="Notifications"
				badge={{ count: 120, label: '120 need your attention' }}
			/>,
		)

		expect(screen.getAllByText('99+')).toHaveLength(2)
		expect(screen.queryByText('120')).toBeNull()
		expect(
			screen.getByRole('button', { name: 'Notifications, 120 need your attention' }),
		).toBeDefined()
	})

	it('names a dot badge without a number', () => {
		render(
			<AppBarAction icon={BellIcon} label="Notifications" badge={{ label: 'new updates' }} />,
		)

		expect(screen.getByRole('button', { name: 'Notifications, new updates' })).toBeDefined()
	})

	it('has no badge text when there is nothing new', () => {
		render(<AppBarAction icon={BellIcon} label="Notifications" />)

		expect(screen.getByRole('button', { name: 'Notifications' })).toBeDefined()
	})
})
