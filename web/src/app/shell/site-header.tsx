import { Link, useLocation } from '@tanstack/react-router'
import { MenuIcon, XIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '$/cn'
import { env } from '$config/env'
import { AppBar, AppBarAction } from '@ui/app-bar'
import { buttonVariants } from '@ui/button-variants'
import { Logo } from '@ui/logo'

import { landingSections } from './destinations'
import { useActiveSection } from './use-active-section'

const sectionIds = landingSections.map((section) => section.id)
const noSectionIds: string[] = []

type SectionLinkProps = {
	id: string
	label: string
	onLanding: boolean
	current: boolean
	className: string
	onNavigate?: () => void
}

const SectionLink = ({ id, label, onLanding, current, className, onNavigate }: SectionLinkProps) =>
	onLanding ? (
		<a
			href={`#${id}`}
			aria-current={current ? 'true' : undefined}
			className={className}
			onClick={onNavigate}
		>
			{label}
		</a>
	) : (
		<Link
			to="/"
			hash={id}
			activeOptions={{ exact: true, includeHash: true }}
			className={className}
			onClick={onNavigate}
		>
			{label}
		</Link>
	)

export const SiteHeader = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const menuId = useId()
	const menuButtonRef = useRef<HTMLButtonElement>(null)
	const onLanding = useLocation({ select: (location) => location.pathname === '/' })
	const activeSection = useActiveSection(onLanding ? sectionIds : noSectionIds)

	useEffect(() => {
		if (!menuOpen) {
			return undefined
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setMenuOpen(false)
				menuButtonRef.current?.focus()
			}
		}

		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [menuOpen])

	const closeMenu = () => setMenuOpen(false)

	return (
		<AppBar
			panel={
				<div
					id={menuId}
					hidden={!menuOpen}
					className="border-border ease-out-strong border-t transition-[opacity,translate] duration-200 motion-reduce:transition-none md:hidden starting:-translate-y-1 starting:opacity-0"
				>
					<nav aria-label="Main" className="mx-auto max-w-6xl px-4 pt-2 pb-5">
						<ul className="flex flex-col">
							{landingSections.map((section) => (
								<li key={section.id}>
									<SectionLink
										id={section.id}
										label={section.label}
										onLanding={onLanding}
										current={activeSection === section.id}
										onNavigate={closeMenu}
										className="focus-visible:outline-foreground aria-[current=true]:bg-primary/20 not-aria-[current=true]:hover:bg-muted flex min-h-12 items-center rounded-xl px-3 text-base font-medium transition-[background-color] duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2"
									/>
								</li>
							))}
						</ul>
						<div className="border-border mt-3 grid gap-2 border-t pt-4">
							<Link
								to="/start"
								onClick={closeMenu}
								className={buttonVariants({ size: 'lg' })}
							>
								Create account
							</Link>
							<Link
								to="/start"
								onClick={closeMenu}
								className={buttonVariants({ variant: 'secondary', size: 'lg' })}
							>
								Sign in
							</Link>
						</div>
					</nav>
				</div>
			}
		>
			<Link
				to="/"
				aria-label={`${env.appName} home`}
				className="focus-visible:outline-foreground relative shrink-0 rounded-lg after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-4"
			>
				<Logo />
			</Link>
			<nav aria-label="Main" className="ms-4 max-md:hidden">
				<ul className="flex items-center gap-1">
					{landingSections.map((section) => (
						<li key={section.id}>
							<SectionLink
								id={section.id}
								label={section.label}
								onLanding={onLanding}
								current={activeSection === section.id}
								className="text-muted-foreground hover:text-foreground focus-visible:outline-foreground aria-[current=true]:bg-primary/20 aria-[current=true]:text-foreground not-aria-[current=true]:hover:bg-muted ease-out-strong pointer-coarse:min-h-12 inline-flex min-h-9 items-center rounded-full px-3.5 text-sm font-medium transition-[color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
							/>
						</li>
					))}
				</ul>
			</nav>
			<div className="ms-auto flex items-center gap-2">
				<Link
					to="/start"
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'relative after:absolute after:-inset-1 max-md:hidden',
					)}
				>
					Sign in
				</Link>
				<Link
					to="/start"
					className={cn(
						buttonVariants(),
						'relative after:absolute after:-inset-1 max-[22.5rem]:hidden',
						menuOpen && 'max-md:hidden',
					)}
				>
					Create account
				</Link>
				<AppBarAction
					ref={menuButtonRef}
					icon={menuOpen ? XIcon : MenuIcon}
					label="Menu"
					aria-expanded={menuOpen}
					aria-controls={menuId}
					onClick={() => setMenuOpen((open) => !open)}
					className="md:hidden"
				/>
			</div>
		</AppBar>
	)
}
