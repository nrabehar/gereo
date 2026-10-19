;(() => {
	let theme = 'system'
	try {
		const stored = localStorage.getItem('gereo-theme')
		if (stored === 'light' || stored === 'dark') theme = stored
	} catch {}
	const dark =
		theme === 'dark' ||
		(theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
	document.documentElement.classList.toggle('dark', dark)
})()
