import { createFileRoute } from '@tanstack/react-router'
import { CircleUserRoundIcon } from 'lucide-react'

import { PagePlaceholder } from '@/app/shell/page-placeholder'
import { ThemeToggle } from '@ui/theme-toggle'

const MePage = () => (
	<PagePlaceholder
		title="Me"
		icon={CircleUserRoundIcon}
		description="Your profile and language, your connected devices, and signing out."
		stories={['ACC-06', 'ACC-11', 'ACC-12']}
	>
		<section aria-labelledby="appearance-title" className="flex flex-col items-start gap-3">
			<h2 id="appearance-title" className="font-heading text-lg font-semibold">
				Appearance
			</h2>
			<ThemeToggle />
		</section>
	</PagePlaceholder>
)

export const Route = createFileRoute('/_app/me')({
	staticData: { title: 'Me' },
	component: MePage,
})
