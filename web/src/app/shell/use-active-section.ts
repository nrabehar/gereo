import { useEffect, useState } from 'react'

const READING_LINE = 0.4
const READING_BAND = '-40% 0px -55% 0px'

export const useActiveSection = (ids: readonly string[]) => {
	const [active, setActive] = useState<string | null>(null)

	useEffect(() => {
		const sections = ids
			.map((id) => document.getElementById(id))
			.filter((section) => section !== null)
		const [first] = sections

		if (!first || typeof IntersectionObserver === 'undefined') {
			return undefined
		}

		const visible = new Set<string>()
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visible.add(entry.target.id)
					} else {
						visible.delete(entry.target.id)
					}
				}

				const current = ids.findLast((id) => visible.has(id))

				if (current) {
					setActive(current)
				} else if (first.getBoundingClientRect().top > window.innerHeight * READING_LINE) {
					setActive(null)
				}
			},
			{ rootMargin: READING_BAND },
		)

		for (const section of sections) {
			observer.observe(section)
		}

		return () => observer.disconnect()
	}, [ids])

	return active
}
