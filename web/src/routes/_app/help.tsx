import { createFileRoute } from '@tanstack/react-router'
import { CircleHelpIcon } from 'lucide-react'

import { PagePlaceholder } from '@/app/shell/page-placeholder'

const HelpPage = () => (
	<PagePlaceholder
		title="Help"
		icon={CircleHelpIcon}
		description="Help for the screen you came from, and a way to reach the Gereo team."
		stories={['XCT-10', 'OPS-06']}
	/>
)

export const Route = createFileRoute('/_app/help')({
	staticData: { title: 'Help' },
	component: HelpPage,
})
