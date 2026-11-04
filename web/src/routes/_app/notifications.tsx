import { createFileRoute } from '@tanstack/react-router'
import { BellIcon } from 'lucide-react'

import { PagePlaceholder } from '@/app/shell/page-placeholder'

const NotificationsPage = () => (
	<PagePlaceholder
		title="Notifications"
		icon={BellIcon}
		description="Everything that happened, newest first, with what needs your action at the top."
		stories={['NTF-01', 'NTF-04']}
	/>
)

export const Route = createFileRoute('/_app/notifications')({
	staticData: { title: 'Notifications' },
	component: NotificationsPage,
})
