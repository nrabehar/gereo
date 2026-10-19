import { beforeEach, describe, expect, it } from 'vitest'

import { applyTheme, readStoredTheme, storeTheme, THEME_STORAGE_KEY } from './theme'

describe('theme', () => {
	beforeEach(() => {
		localStorage.clear()
		document.documentElement.classList.remove('dark')
	})

	it('defaults to system when nothing is stored', () => {
		expect(readStoredTheme()).toBe('system')
	})

	it('persists explicit themes and clears the key for system', () => {
		storeTheme('dark')
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
		expect(readStoredTheme()).toBe('dark')
		storeTheme('system')
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
	})

	it('toggles the dark class on the root element', () => {
		applyTheme('dark')
		expect(document.documentElement.classList.contains('dark')).toBe(true)
		applyTheme('light')
		expect(document.documentElement.classList.contains('dark')).toBe(false)
	})
})
