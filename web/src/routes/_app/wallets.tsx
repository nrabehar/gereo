import { createFileRoute } from '@tanstack/react-router'
import { WalletIcon } from 'lucide-react'

import { PagePlaceholder } from '@/app/shell/page-placeholder'

const WalletsPage = () => (
	<PagePlaceholder
		title="Wallets"
		icon={WalletIcon}
		description="All your wallets, what each one holds and what is safe to spend."
		stories={['WAL-02', 'WAL-03']}
	/>
)

export const Route = createFileRoute('/_app/wallets')({
	staticData: { title: 'Wallets' },
	component: WalletsPage,
})
