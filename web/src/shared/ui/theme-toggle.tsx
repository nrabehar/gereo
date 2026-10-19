import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { useTheme } from '@/shared/theme/use-theme'
import type { Theme } from '@/shared/theme/theme'
import { cn } from '$/cn'

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
	{ value: 'light', label: 'Light', icon: SunIcon },
	{ value: 'dark', label: 'Dark', icon: MoonIcon },
	{ value: 'system', label: 'System', icon: MonitorIcon },
]

export const ThemeToggle = ({ className }: { className?: string }) => {
	const { theme, setTheme } = useTheme()
	const activeIndex = options.findIndex((option) => option.value === theme)

	return (
		<fieldset
			aria-label="Theme"
			className={cn(
				'bg-muted ring-border relative inline-grid shrink-0 grid-cols-[repeat(3,1fr)] rounded-xl p-1 ring-1 ring-inset',
				className,
			)}
		>
			<span
				aria-hidden="true"
				className="bg-background dark:bg-accent absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg shadow-sm transition-transform duration-200 ease-in-out-strong motion-reduce:transition-none"
				style={{ transform: `translateX(${activeIndex * 100}%)` }}
			/>
			{options.map(({ value, label, icon: Icon }) => (
				<button
					key={value}
					type="button"
					aria-pressed={theme === value}
					onClick={() => setTheme(value)}
					className={cn(
						'focus-visible:outline-foreground relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap text-sm font-medium transition-[color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 motion-safe:active:scale-[0.97]',
						theme === value
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground',
					)}
				>
					<Icon aria-hidden="true" className="size-4 shrink-0" />
					{label}
				</button>
			))}
		</fieldset>
	)
}
