import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type PagePlaceholderProps = {
	title: string
	icon: LucideIcon
	description: string
	stories: string[]
	titleInAppBar?: boolean
	children?: ReactNode
}

export const PagePlaceholder = ({
	title,
	icon: Icon,
	description,
	stories,
	titleInAppBar = true,
	children,
}: PagePlaceholderProps) => (
	<div className="flex flex-col gap-8">
		<h1
			className={cn(
				'font-heading text-3xl leading-tight font-semibold tracking-[-0.02em]',
				titleInAppBar && 'max-md:sr-only',
			)}
		>
			{title}
		</h1>
		<div className="border-border flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center">
			<span className="bg-muted text-muted-foreground ring-border grid size-12 place-items-center rounded-full ring-1 ring-inset">
				<Icon aria-hidden="true" className="size-5" />
			</span>
			<p className="font-heading font-semibold tracking-[-0.01em]">
				This page is not built yet
			</p>
			<p className="text-muted-foreground max-w-sm text-sm text-pretty">{description}</p>
			<p className="text-muted-foreground text-xs">Stories: {stories.join(', ')}</p>
		</div>
		{children}
	</div>
)
