import type { LinkProps } from '@tanstack/react-router'
import { CircleUserRoundIcon, HouseIcon, UsersIcon, WalletIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Destination = {
	id: string
	label: string
	icon: LucideIcon
	to: NonNullable<LinkProps['to']>
}

const home: Destination = { id: 'home', label: 'Home', icon: HouseIcon, to: '/home' }
const wallets: Destination = { id: 'wallets', label: 'Wallets', icon: WalletIcon, to: '/wallets' }
const groups: Destination = { id: 'groups', label: 'Groups', icon: UsersIcon, to: '/groups' }
const me: Destination = { id: 'me', label: 'Me', icon: CircleUserRoundIcon, to: '/me' }

export const destinations = [home, wallets, groups, me]

export const primaryDestinations = [home, wallets, groups]

export const accountDestination = me

export const landingSections = [
	{ id: 'how-it-works', label: 'How it works' },
	{ id: 'safety', label: 'Safety' },
	{ id: 'questions', label: 'Questions' },
] as const
