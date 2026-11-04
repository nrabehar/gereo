import { createFileRoute } from '@tanstack/react-router'
import { UsersIcon } from 'lucide-react'

import { PagePlaceholder } from '@/app/shell/page-placeholder'

const GroupsPage = () => (
	<PagePlaceholder
		title="Groups"
		icon={UsersIcon}
		description="The groups you belong to, who is in them and where each one stands."
		stories={['GRP-05', 'GRP-06']}
	/>
)

export const Route = createFileRoute('/_app/groups')({
	staticData: { title: 'Groups' },
	component: GroupsPage,
})
