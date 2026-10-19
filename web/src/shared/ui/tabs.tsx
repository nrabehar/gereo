import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type TabItem = {
	value: string
	label: ReactNode
	content: ReactNode
	disabled?: boolean
}

type TabsProps = {
	items: TabItem[]
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	className?: string
}

export const Tabs = ({ items, value, defaultValue, onValueChange, className }: TabsProps) => (
	<BaseTabs.Root
		value={value}
		defaultValue={value === undefined ? (defaultValue ?? items[0]?.value) : undefined}
		onValueChange={(next) => onValueChange?.(String(next))}
		className={cn('flex flex-col', className)}
	>
		<BaseTabs.List className="bg-muted ring-border relative isolate inline-flex w-fit max-w-full overflow-x-auto rounded-xl p-1 ring-1 ring-inset">
			{items.map((item) => (
				<BaseTabs.Tab
					key={item.value}
					value={item.value}
					disabled={item.disabled}
					className="text-muted-foreground hover:text-foreground data-active:text-foreground focus-visible:outline-foreground cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-[color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:active:scale-[0.97]"
				>
					{item.label}
				</BaseTabs.Tab>
			))}
			<BaseTabs.Indicator className="bg-background dark:bg-accent absolute top-1 left-0 -z-10 h-[calc(100%-0.5rem)] w-(--active-tab-width) translate-x-(--active-tab-left) rounded-lg shadow-sm transition-[translate,width] duration-200 ease-in-out-strong motion-reduce:transition-none" />
		</BaseTabs.List>
		{items.map((item) => (
			<BaseTabs.Panel
				key={item.value}
				value={item.value}
				className="focus-visible:outline-foreground mt-4 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
			>
				{item.content}
			</BaseTabs.Panel>
		))}
	</BaseTabs.Root>
)
