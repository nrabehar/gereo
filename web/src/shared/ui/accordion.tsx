import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { ChevronDownIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type AccordionItem = {
	value: string
	title: ReactNode
	content: ReactNode
	disabled?: boolean
}

type AccordionProps = {
	items: AccordionItem[]
	multiple?: boolean
	defaultValue?: string[]
	value?: string[]
	onValueChange?: (value: string[]) => void
	className?: string
}

export const Accordion = ({
	items,
	multiple = false,
	defaultValue,
	value,
	onValueChange,
	className,
}: AccordionProps) => (
	<BaseAccordion.Root
		multiple={multiple}
		defaultValue={value === undefined ? defaultValue : undefined}
		value={value}
		onValueChange={(next) => onValueChange?.(next.map(String))}
		className={cn(
			'border-border bg-card flex w-full flex-col overflow-hidden rounded-xl border',
			className,
		)}
	>
		{items.map((item) => (
			<BaseAccordion.Item
				key={item.value}
				value={item.value}
				disabled={item.disabled}
				className="border-border not-first:border-t"
			>
				<BaseAccordion.Header>
					<BaseAccordion.Trigger className="hover:bg-muted/60 focus-visible:outline-foreground group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-start text-sm font-medium transition-colors duration-150 select-none focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
						{item.title}
						<ChevronDownIcon
							aria-hidden="true"
							className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 ease-out-strong group-data-panel-open:rotate-180 motion-reduce:transition-none"
						/>
					</BaseAccordion.Trigger>
				</BaseAccordion.Header>
				<BaseAccordion.Panel className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-out-strong data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
					<div className="text-muted-foreground px-4 pb-4 text-pretty">
						{item.content}
					</div>
				</BaseAccordion.Panel>
			</BaseAccordion.Item>
		))}
	</BaseAccordion.Root>
)
