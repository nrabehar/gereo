export type Theme = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'gereo-theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export const readStoredTheme = (): Theme => {
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY)
		return stored === 'light' || stored === 'dark' ? stored : 'system'
	} catch {
		return 'system'
	}
}

export const storeTheme = (theme: Theme) => {
	try {
		if (theme === 'system') {
			localStorage.removeItem(THEME_STORAGE_KEY)
		} else {
			localStorage.setItem(THEME_STORAGE_KEY, theme)
		}
	} catch {
		return
	}
}

export const systemPrefersDark = () => matchMedia(DARK_QUERY).matches

export const subscribeSystemTheme = (onChange: () => void) => {
	const query = matchMedia(DARK_QUERY)
	query.addEventListener('change', onChange)
	return () => query.removeEventListener('change', onChange)
}

export const resolveDark = (theme: Theme) =>
	theme === 'dark' || (theme === 'system' && systemPrefersDark())

export const applyTheme = (theme: Theme) => {
	document.documentElement.classList.toggle('dark', resolveDark(theme))
}
