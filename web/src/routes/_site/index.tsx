import { createFileRoute, Link } from '@tanstack/react-router'

import { landingSections } from '@/app/shell/destinations'
import { Accordion } from '@ui/accordion'
import { buttonVariants } from '@ui/button-variants'

const [howItWorks, safety, questions] = landingSections

const steps = [
	{
		title: 'Start a group',
		text: 'Invite members by link or phone number, and choose who can approve spending.',
	},
	{
		title: 'Collect contributions',
		text: 'Members pay from mobile money. Each payment lands in the shared record.',
	},
	{
		title: 'Decide together',
		text: 'A request to spend needs other members to approve it, or the group to vote.',
	},
	{
		title: 'Follow every ariary',
		text: 'Members see where the money went, with a reference for each entry.',
	},
]

const safeguards = [
	{
		title: 'No one moves the money alone',
		text: 'Money leaves a group wallet only after other members approve, or after the group votes for it.',
	},
	{
		title: 'Nothing is erased',
		text: 'Every entry stays in the record. A mistake is fixed with a new entry, never by editing the old one.',
	},
	{
		title: 'Your PIN for every payment',
		text: 'Sending money or approving a payment always asks for your PIN.',
	},
]

const faq = [
	{
		value: 'who-sees',
		title: 'Who can see our group’s money?',
		content:
			'Members see the group’s balance and every entry in its record. The founder chooses who can approve spending.',
	},
	{
		value: 'vote-by-link',
		title: 'Does everyone need the app to vote?',
		content:
			'No. A vote link sent by SMS lets someone vote with their phone number and a code.',
	},
	{
		value: 'weak-connection',
		title: 'What if my connection is weak?',
		content:
			'You can still read what was last saved on your phone. Sending money needs a connection, so a payment is never sent twice.',
	},
]

const sectionTitle =
	'font-heading text-3xl leading-tight font-semibold tracking-[-0.02em] md:text-4xl'

const LandingPage = () => (
	<>
		<section className="mx-auto max-w-6xl px-4 pt-14 pb-20 md:px-6 md:pt-24 md:pb-28">
			<p className="text-muted-foreground text-sm font-medium">
				For associations, savings groups and families
			</p>
			<h1 className="font-heading mt-4 max-w-4xl text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-7xl">
				See{' '}
				<span className="decoration-primary underline decoration-[0.14em] underline-offset-[0.14em] [text-decoration-skip-ink:none]">
					every ariary
				</span>{' '}
				your group saves and spends.
			</h1>
			<p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">
				Gereo keeps your group’s contributions, spending and decisions in one shared record,
				and no one can move the group’s money alone.
			</p>
			<div className="mt-9 flex flex-wrap gap-3">
				<Link to="/start" className={buttonVariants({ size: 'lg' })}>
					Create account
				</Link>
				<a
					href={`#${howItWorks.id}`}
					className={buttonVariants({ variant: 'outline', size: 'lg' })}
				>
					See how it works
				</a>
			</div>
		</section>

		<section
			id={howItWorks.id}
			aria-labelledby={`${howItWorks.id}-title`}
			className="bg-card border-border border-y"
		>
			<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
				<h2 id={`${howItWorks.id}-title`} className={sectionTitle}>
					{howItWorks.label}
				</h2>
				<ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, index) => (
						<li key={step.title} className="flex flex-col gap-3">
							<span
								aria-hidden="true"
								className="bg-primary text-primary-foreground font-heading grid size-9 place-items-center rounded-full text-sm font-semibold"
							>
								{index + 1}
							</span>
							<h3 className="font-heading text-lg font-semibold tracking-[-0.01em]">
								{step.title}
							</h3>
							<p className="text-muted-foreground text-pretty">{step.text}</p>
						</li>
					))}
				</ol>
			</div>
		</section>

		<section id={safety.id} aria-labelledby={`${safety.id}-title`}>
			<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
				<h2 id={`${safety.id}-title`} className={sectionTitle}>
					{safety.label}
				</h2>
				<p className="text-muted-foreground mt-3 max-w-xl text-lg text-pretty">
					The rules that protect your group’s money are built in, not left to trust.
				</p>
				<ul className="mt-10 grid gap-4 md:grid-cols-3">
					{safeguards.map((safeguard) => (
						<li
							key={safeguard.title}
							className="bg-card ring-foreground/6 flex flex-col gap-2 rounded-3xl p-6 ring-1"
						>
							<h3 className="font-heading text-lg font-semibold tracking-[-0.01em]">
								{safeguard.title}
							</h3>
							<p className="text-muted-foreground text-pretty">{safeguard.text}</p>
						</li>
					))}
				</ul>
			</div>
		</section>

		<section
			id={questions.id}
			aria-labelledby={`${questions.id}-title`}
			className="bg-card border-border min-h-[60dvh] border-t"
		>
			<div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
				<h2 id={`${questions.id}-title`} className={sectionTitle}>
					{questions.label}
				</h2>
				<Accordion className="mt-8" items={faq} />
			</div>
		</section>
	</>
)

export const Route = createFileRoute('/_site/')({
	component: LandingPage,
})
