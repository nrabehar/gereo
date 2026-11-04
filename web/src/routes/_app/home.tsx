import { createFileRoute } from '@tanstack/react-router'
import { HouseIcon } from 'lucide-react'

import { PagePlaceholder } from '@/app/shell/page-placeholder'

const HomePage = () => (
	<PagePlaceholder
		title="Home"
		titleInAppBar={false}
		icon={HouseIcon}
		description="What needs you first, such as approvals, votes closing soon and contributions due, then your wallets."
		stories={['NTF-01', 'WAL-02', 'GRP-06']}
	/>
)

export const Route = createFileRoute('/_app/home')({
	component: HomePage,
})
