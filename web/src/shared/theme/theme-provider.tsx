import { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import type { ReactNode } from 'react'

import {
	applyTheme,
	readStoredTheme,
	resolveDark,
	storeTheme,
	subscribeSystemTheme,
	THEME_STORAGE_KEY,
} from './theme'
import type { Theme } from './theme'
import { ThemeContext } from './theme-context'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>(readStoredTheme)
	const [isDark, setIsDark] = useState(() => resolveDark(readStoredTheme()))

	const setTheme = useCallback((next: Theme) => {
		const commit = () => {
			storeTheme(next)
			applyTheme(next)
			flushSync(() => setThemeState(next))
		}
		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

		if (typeof document.startViewTransition === 'function' && !reduceMotion) {
			document.startViewTransition(commit)
		} else {
			commit()
		}
	}, [])

	useEffect(() => {
		const sync = () => {
			applyTheme(theme)
			setIsDark(resolveDark(theme))
		}
		sync()
		return theme === 'system' ? subscribeSystemTheme(sync) : undefined
	}, [theme])

	useEffect(() => {
		const onStorage = (event: StorageEvent) => {
			if (event.key === THEME_STORAGE_KEY || event.key === null) {
				setThemeState(readStoredTheme())
			}
		}
		window.addEventListener('storage', onStorage)
		return () => window.removeEventListener('storage', onStorage)
	}, [])

	const value = useMemo(() => ({ theme, isDark, setTheme }), [theme, isDark, setTheme])

	return <ThemeContext value={value}>{children}</ThemeContext>
}
