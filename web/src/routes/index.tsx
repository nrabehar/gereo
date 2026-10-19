import { createFileRoute } from '@tanstack/react-router'
import {
	ArrowDownLeftIcon,
	CalendarDaysIcon,
	HouseIcon,
	LayoutListIcon,
	RowsIcon,
	FolderKanbanIcon,
	BanknoteIcon,
	InboxIcon,
	SmartphoneIcon,
	ArrowUpRightIcon,
	CopyIcon,
	EllipsisIcon,
	EyeIcon,
	EyeOffIcon,
	LandmarkIcon,
	PiggyBankIcon,
	UsersIcon,
	VoteIcon,
	WalletIcon,
	MailIcon,
	SettingsIcon,
	PencilIcon,
	PlusIcon,
	SearchIcon,
	ShareIcon,
	TrashIcon,
	XIcon,
} from 'lucide-react'
import { useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { env } from '$config/env'
import { AlertDialog } from '@ui/alert-dialog'
import { AllocationBar } from '@ui/allocation-bar'
import { Accordion } from '@ui/accordion'
import { Alert } from '@ui/alert'
import { Avatar } from '@ui/avatar'
import { Badge } from '@ui/badge'
import { BarChart } from '@ui/bar-chart'
import { Breadcrumb } from '@ui/breadcrumb'
import { BottomNav } from '@ui/bottom-nav'
import { Button } from '@ui/button'
import { Calendar } from '@ui/calendar'
import { Card } from '@ui/card'
import { ChoiceCards } from '@ui/choice-cards'
import { Checkbox } from '@ui/checkbox'
import { Combobox } from '@ui/combobox'
import { DatePicker } from '@ui/date-picker'
import { Dialog } from '@ui/dialog'
import { DonutChart } from '@ui/donut-chart'
import { EmptyState } from '@ui/empty-state'
import { FileUpload } from '@ui/file-upload'
import { DropdownMenu } from '@ui/dropdown-menu'
import { Input } from '@ui/input'
import { LineChart } from '@ui/line-chart'
import { Money } from '@ui/money'
import { MoneyInput } from '@ui/money-input'
import { NumberField } from '@ui/number-field'
import { OtpInput } from '@ui/otp-input'
import { PhoneInput } from '@ui/phone-input'
import { PollOptions } from '@ui/poll-options'
import { Pagination } from '@ui/pagination'
import { Popover } from '@ui/popover'
import { Progress } from '@ui/progress'
import { Radio } from '@ui/radio'
import { SegmentedControl } from '@ui/segmented-control'
import { Separator } from '@ui/separator'
import { Sheet } from '@ui/sheet'
import { Sidebar } from '@ui/sidebar'
import { Skeleton } from '@ui/skeleton'
import { Slider } from '@ui/slider'
import { Stat } from '@ui/stat'
import { Stepper } from '@ui/stepper'
import { Switch } from '@ui/switch'
import { Table } from '@ui/table'
import { Tabs } from '@ui/tabs'
import { TagInput } from '@ui/tag-input'
import { Timeline } from '@ui/timeline'
import { Textarea } from '@ui/textarea'
import { toast } from '@ui/toast'
import { Tooltip } from '@ui/tooltip'
import { ThemeToggle } from '@ui/theme-toggle'

type ButtonVariant = NonNullable<ComponentProps<typeof Button>['variant']>

const variants: ButtonVariant[] = [
	'primary',
	'destructive',
	'secondary',
	'ghost',
	'outline',
	'link',
]
const sizes = ['sm', 'md', 'lg'] as const
const countries = [
	{ value: 'mg', label: 'Madagascar' },
	{ value: 'fr', label: 'France' },
	{ value: 'de', label: 'Germany' },
	{ value: 'es', label: 'Spain' },
	{ value: 'it', label: 'Italy' },
	{ value: 'pt', label: 'Portugal' },
	{ value: 'be', label: 'Belgium' },
	{ value: 'ch', label: 'Switzerland' },
	{ value: 'ca', label: 'Canada' },
	{ value: 'us', label: 'United States' },
	{ value: 'mu', label: 'Mauritius' },
	{ value: 're', label: 'Réunion' },
	{ value: 'za', label: 'South Africa' },
	{ value: 'ke', label: 'Kenya' },
	{ value: 'ma', label: 'Morocco' },
]

const plans = [
	{ value: 'free', label: 'Free' },
	{ value: 'pro', label: 'Pro' },
	{ value: 'team', label: 'Team', disabled: true },
]

type Member = { id: string; name: string; role: string; status: 'active' | 'invited' }

const members: Member[] = [
	{ id: '1', name: 'Nekena Rabeharivonjy', role: 'Owner', status: 'active' },
	{ id: '2', name: 'Hery Andria', role: 'Editor', status: 'active' },
	{ id: '3', name: 'Lova Rakoto', role: 'Viewer', status: 'invited' },
]

const inputSizes = ['sm', 'md', 'lg'] as const
const iconSizes = ['icon-sm', 'icon', 'icon-lg'] as const

const swatches = [
	'bg-background',
	'bg-primary',
	'bg-secondary',
	'bg-muted',
	'bg-accent',
	'bg-destructive',
	'bg-card',
	'bg-border',
]

const InputIconDemos = () => {
	const [query, setQuery] = useState('')
	const [email, setEmail] = useState('')
	const [revealed, setRevealed] = useState(false)

	return (
		<div className="grid gap-3 sm:grid-cols-3">
			<Input
				label="Start icon"
				placeholder="Search"
				startIcon={{ icon: SearchIcon }}
				value={query}
				onChange={(event) => setQuery(event.target.value)}
			/>
			<Input
				label="End action"
				type={revealed ? 'text' : 'password'}
				defaultValue="secret"
				endIcon={{
					icon: revealed ? EyeOffIcon : EyeIcon,
					label: revealed ? 'Hide password' : 'Show password',
					onClick: () => setRevealed((value) => !value),
				}}
			/>
			<Input
				label="Both"
				placeholder="Email"
				startIcon={{ icon: MailIcon }}
				endIcon={{
					icon: XIcon,
					label: 'Clear',
					hidden: !email,
					onClick: () => setEmail(''),
				}}
				value={email}
				onChange={(event) => setEmail(event.target.value)}
			/>
		</div>
	)
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<section className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-xs">
		<h2 className="text-muted-foreground text-xs font-medium tracking-[0.06em] uppercase">
			{title}
		</h2>
		{children}
	</section>
)

const NavigationDemos = () => {
	const [page, setPage] = useState(3)

	return (
		<div className="space-y-6">
			<Breadcrumb
				items={[
					{ label: 'Home', to: '/' },
					{ label: 'Settings', to: '/' },
					{ label: 'Profile' },
				]}
			/>
			<Tabs
				items={[
					{
						value: 'overview',
						label: 'Overview',
						content: <p className="text-sm">Workspace stats and activity.</p>,
					},
					{
						value: 'projects',
						label: 'Projects',
						content: <p className="text-sm">Milestones and deadlines.</p>,
					},
					{
						value: 'account',
						label: 'Account',
						content: <p className="text-sm">Profile and preferences.</p>,
					},
					{ value: 'billing', label: 'Billing', content: null, disabled: true },
				]}
			/>
			<Pagination page={page} pageCount={12} onPageChange={setPage} />
			<div className="flex flex-wrap items-center gap-3">
				<DropdownMenu
					trigger={
						<Button variant="outline" size="icon" aria-label="More actions">
							<EllipsisIcon />
						</Button>
					}
					items={[
						{ label: 'Edit', icon: PencilIcon, shortcut: '⌘E' },
						{
							label: 'Duplicate',
							icon: CopyIcon,
							shortcut: '⌘D',
							onSelect: () => toast.success('Duplicated'),
						},
						{ label: 'Share', icon: ShareIcon, disabled: true },
						{ type: 'separator' },
						{
							label: 'Delete',
							icon: TrashIcon,
							destructive: true,
							onSelect: () => toast.error('Deleted'),
						},
					]}
				/>
				<Popover
					trigger={
						<Button variant="outline">
							<SettingsIcon /> Settings
						</Button>
					}
					title="Quick settings"
					description="Adjust how this page behaves."
				>
					<Switch label="Compact mode" />
					<Switch label="Show badges" defaultChecked />
				</Popover>
				<Sheet
					trigger={<Button variant="secondary">Open sheet</Button>}
					title="Filters"
					description="Narrow down the results."
					footer={<Button>Apply filters</Button>}
				>
					<div className="space-y-4">
						<Input label="Search" placeholder="Name or email" />
						<Slider label="Minimum score" defaultValue={40} showValue />
					</div>
				</Sheet>
				<Sheet
					side="bottom"
					trigger={<Button variant="secondary">Bottom sheet</Button>}
					title="Share"
					description="Anyone with the link can view."
				/>
			</div>
		</div>
	)
}

const DataDemos = () => {
	const [volume, setVolume] = useState(60)

	return (
		<div className="space-y-6">
			<Table
				caption="Team members"
				rows={members}
				getRowKey={(member) => member.id}
				columns={[
					{
						key: 'name',
						header: 'Member',
						renderCell: (member) => (
							<div className="flex items-center gap-3">
								<Avatar name={member.name} size="sm" />
								<span className="font-medium">{member.name}</span>
							</div>
						),
					},
					{ key: 'role', header: 'Role', renderCell: (member) => member.role },
					{
						key: 'status',
						header: 'Status',
						align: 'end',
						renderCell: (member) => (
							<Badge variant={member.status === 'active' ? 'success' : 'neutral'}>
								{member.status}
							</Badge>
						),
					},
				]}
			/>
			<div className="flex items-center gap-3">
				<Avatar name="Nekena Rabeharivonjy" size="sm" />
				<Avatar name="Hery Andria" />
				<Avatar name="Lova" size="lg" />
				<Separator orientation="vertical" className="h-8" />
				<Avatar name="Broken image" src="/missing.png" />
			</div>
			<Separator />
			<div className="grid gap-6 sm:grid-cols-2">
				<div className="space-y-4">
					<Progress label="Export" value={64} showValue />
					<Progress aria-label="Small" value={30} size="sm" />
					<Progress aria-label="Large" value={85} size="lg" />
					<Progress aria-label="Loading" value={null} />
				</div>
				<div className="space-y-4">
					<Slider label="Volume" value={volume} onValueChange={setVolume} showValue />
					<Slider aria-label="Disabled" defaultValue={30} disabled />
				</div>
			</div>
		</div>
	)
}

const MoneyDemos = () => {
	const [amount, setAmount] = useState<number | null>(150000)

	return (
		<div className="space-y-8">
			<div className="grid gap-4 sm:grid-cols-3">
				<Stat
					label="Group balance"
					icon={WalletIcon}
					value={<Money amount={4850000} />}
					delta={{ value: 12.4, label: 'vs last month' }}
					trend={[3.1, 3.4, 3.2, 3.9, 4.2, 4.85]}
				/>
				<Stat
					label="Contributions"
					icon={UsersIcon}
					value={<Money amount={1200000} />}
					delta={{ value: -3.1, label: 'vs last month' }}
				/>
				<Stat
					label="Reserve"
					icon={PiggyBankIcon}
					value={<Money amount={750000} />}
					hint="Unchanged this month"
				/>
			</div>
			<div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
				<Money amount={1250000} size="xl" />
				<Money amount={1250000} size="lg" />
				<Money amount={-45000} size="md" colored />
				<Money amount={320000} size="md" colored />
				<Money amount={0} size="sm" colored />
				<Money amount={89.9} currency="EUR" size="sm" />
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<MoneyInput
					label="Contribution"
					info={amount === null ? 'Enter an amount' : `Value: ${amount}`}
					value={amount}
					onValueChange={setAmount}
				/>
				<MoneyInput
					label="Invalid amount"
					error="Must be above 5 000 Ar."
					defaultValue={1200}
				/>
			</div>
			<div className="grid gap-8 sm:grid-cols-3">
				<AllocationBar
					segments={[
						{ label: 'Project Alpha', value: 40 },
						{ label: 'Reserve', value: 20 },
						{ label: 'Members', value: 10 },
					]}
				/>
				<AllocationBar segments={[{ label: 'Reserve', value: 1 }]} />
				<AllocationBar
					segments={[
						{ label: 'Project Alpha', value: 70 },
						{ label: 'Reserve', value: 50 },
					]}
				/>
			</div>
			<Timeline
				items={[
					{
						id: '1',
						title: 'Contribution from Hery Andria',
						description: 'Monthly contribution, Mvola',
						time: 'Today, 09:41',
						icon: ArrowDownLeftIcon,
						tone: 'success',
						aside: <Money amount={50000} colored />,
					},
					{
						id: '2',
						title: 'Revenue split applied',
						description: '3 destinations updated',
						time: 'Yesterday, 18:02',
						icon: LandmarkIcon,
						tone: 'primary',
					},
					{
						id: '3',
						title: 'Vote closed: buy equipment',
						description: 'Approved by 7 of 9 members',
						time: '14 Oct, 12:00',
						icon: VoteIcon,
					},
					{
						id: '4',
						title: 'Expense approved',
						description: 'Equipment for Project Alpha',
						time: '14 Oct, 12:05',
						icon: ArrowUpRightIcon,
						tone: 'destructive',
						aside: <Money amount={-320000} colored />,
					},
				]}
			/>
		</div>
	)
}

const months = ['Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct']
const formatAr = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)}\u00a0Ar`

const ChartDemos = () => (
	<div className="space-y-10">
		<div className="grid gap-8 lg:grid-cols-2">
			<div className="space-y-3">
				<h3 className="text-sm font-medium">Contributions and expenses</h3>
				<LineChart
					caption="Contributions and expenses per month"
					labels={months}
					formatValue={formatAr}
					series={[
						{
							id: 'in',
							label: 'Contributions',
							data: [900000, 1100000, 950000, 1300000, 1250000, 1500000],
						},
						{
							id: 'out',
							label: 'Expenses',
							data: [400000, 650000, 300000, 800000, 520000, 900000],
						},
					]}
				/>
			</div>
			<div className="space-y-3">
				<h3 className="text-sm font-medium">Balance</h3>
				<LineChart
					caption="Balance per month"
					labels={months}
					formatValue={formatAr}
					area
					series={[
						{
							id: 'balance',
							label: 'Balance',
							data: [2100000, 2550000, 3200000, 3700000, 4430000, 5030000],
						},
					]}
				/>
			</div>
		</div>
		<div className="grid gap-8 lg:grid-cols-2">
			<div className="space-y-3">
				<h3 className="text-sm font-medium">Revenue by source</h3>
				<BarChart
					caption="Revenue by source per month"
					labels={months}
					formatValue={formatAr}
					series={[
						{
							id: 'sales',
							label: 'Sales',
							data: [500000, 620000, 540000, 780000, 700000, 910000],
						},
						{
							id: 'dues',
							label: 'Dues',
							data: [300000, 300000, 300000, 320000, 320000, 340000],
						},
						{
							id: 'donations',
							label: 'Donations',
							data: [0, 120000, 60000, 90000, 150000, 110000],
						},
					]}
				/>
			</div>
			<div className="space-y-3">
				<h3 className="text-sm font-medium">Where the money goes</h3>
				<DonutChart
					caption="Spending by destination"
					formatValue={formatAr}
					centerLabel="Total"
					centerValue="3,2 M"
					slices={[
						{ id: 'alpha', label: 'Project Alpha', value: 1600000 },
						{ id: 'reserve', label: 'Reserve', value: 800000 },
						{ id: 'events', label: 'Events', value: 500000 },
						{ id: 'other', label: 'Other', value: 300000 },
					]}
				/>
			</div>
		</div>
	</div>
)

const DateDemos = () => {
	const [date, setDate] = useState<Date | null>(null)
	const [today] = useState(() => new Date())

	return (
		<div className="grid gap-8 md:grid-cols-2">
			<div className="space-y-4">
				<DatePicker
					label="Event date"
					info={date ? undefined : 'Reminders go out the day before.'}
					value={date}
					onValueChange={setDate}
				/>
				<DatePicker
					label="Deadline"
					error="Pick a date in the future."
					min={today}
					required
				/>
				<DatePicker label="Disabled" disabled />
			</div>
			<Calendar defaultValue={today} className="border-border rounded-xl border p-3" />
		</div>
	)
}

const OnboardingDemos = () => {
	const [step, setStep] = useState(1)
	const [code, setCode] = useState('')
	const [dismissed, setDismissed] = useState(false)

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<Stepper
					current={step}
					steps={[
						{ label: 'Account', description: 'Phone and password' },
						{ label: 'Identity', description: 'Verify who you are' },
						{ label: 'First wallet', description: 'Set your rules' },
					]}
				/>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						disabled={step === 0}
						onClick={() => setStep(step - 1)}
					>
						Back
					</Button>
					<Button size="sm" disabled={step === 3} onClick={() => setStep(step + 1)}>
						Next
					</Button>
				</div>
			</div>
			<div className="grid gap-6 sm:grid-cols-2">
				<PhoneInput label="Phone number" info="We will send you a code." required />
				<OtpInput
					label="Verification code"
					info="Enter the 6 digits we sent."
					value={code}
					onValueChange={setCode}
					onComplete={() => toast.success('Code verified')}
				/>
				<OtpInput label="Wrong code" error="This code is not valid." defaultValue="123" />
				<ChoiceCards
					label="Payment operator"
					name="operator"
					columns={1}
					defaultValue="mvola"
					items={[
						{
							value: 'mvola',
							label: 'Mvola',
							description: 'Pay with your Mvola account',
							icon: SmartphoneIcon,
						},
						{
							value: 'orange',
							label: 'Orange Money',
							description: 'Pay with Orange Money',
							icon: SmartphoneIcon,
						},
						{
							value: 'airtel',
							label: 'Airtel Money',
							description: 'Temporarily unavailable',
							icon: SmartphoneIcon,
							disabled: true,
						},
					]}
				/>
			</div>
			<div className="grid gap-6 sm:grid-cols-2">
				<FileUpload
					label="Identity document"
					accept="image/*,.pdf"
					maxSize={2 * 1024 * 1024}
					info="A photo or a scan of your ID."
					required
				/>
				<FileUpload
					label="Documents"
					multiple
					accept=".pdf"
					error="At least one document is required."
				/>
			</div>
			<ChoiceCards
				label="Contribution frequency"
				name="frequency"
				columns={3}
				defaultValue="monthly"
				items={[
					{ value: 'weekly', label: 'Weekly', description: 'Every Monday' },
					{ value: 'monthly', label: 'Monthly', description: 'The 1st of each month' },
					{ value: 'yearly', label: 'Yearly', description: 'Once a year' },
				]}
			/>
			<div className="grid gap-3">
				<Alert variant="info" title="Daily limit">
					Withdrawals are limited to 5 000 000 Ar per day until your identity is verified.
				</Alert>
				<Alert variant="success" title="Contribution received">
					Your payment of 50 000 Ar was confirmed.
				</Alert>
				<Alert
					variant="warning"
					title="Identity not verified"
					action={
						<Button size="sm" variant="outline">
							Verify now
						</Button>
					}
				>
					Verify your identity to raise your limits.
				</Alert>
				{!dismissed && (
					<Alert
						variant="destructive"
						title="Payment failed"
						onDismiss={() => setDismissed(true)}
					>
						Mvola declined the transaction. Try again or use another operator.
					</Alert>
				)}
			</div>
			<EmptyState
				icon={InboxIcon}
				title="No transactions yet"
				description="Contributions and expenses will appear here once the group starts moving money."
				action={
					<>
						<Button>Make a contribution</Button>
						<Button variant="outline">
							<BanknoteIcon /> Add funds
						</Button>
					</>
				}
			/>
		</div>
	)
}

const GovernanceDemos = () => {
	const [vote, setVote] = useState<string | null>(null)
	const [frequency, setFrequency] = useState('monthly')
	const options = [
		{ id: 'yes', label: 'Buy the equipment now', votes: vote === 'yes' ? 6 : 5 },
		{ id: 'later', label: 'Wait until next quarter', votes: vote === 'later' ? 3 : 2 },
		{ id: 'no', label: 'Do not buy', votes: vote === 'no' ? 2 : 1 },
	]

	return (
		<div className="space-y-10">
			<div className="grid gap-6 sm:grid-cols-2">
				<PollOptions
					label="Should the group buy the equipment?"
					options={options}
					value={vote}
					onValueChange={setVote}
					showResults={vote !== null}
				/>
				<div className="space-y-6">
					<SegmentedControl
						label="Frequency"
						value={frequency}
						onValueChange={setFrequency}
						items={[
							{ value: 'weekly', label: 'Weekly' },
							{ value: 'monthly', label: 'Monthly' },
							{ value: 'yearly', label: 'Yearly' },
						]}
					/>
					<div className="grid grid-cols-2 gap-4">
						<NumberField label="Share (%)" defaultValue={25} min={0} max={100} />
						<NumberField
							label="Amount"
							defaultValue={50000}
							step={5000}
							min={0}
							format={{ maximumFractionDigits: 0 }}
						/>
					</div>
					<TagInput
						label="Invite by phone"
						placeholder="034 12 345 67, then Enter"
						info="Press Enter or comma to add."
						defaultValue={['034 11 111 11']}
					/>
				</div>
			</div>
			<Accordion
				defaultValue={['rules']}
				items={[
					{
						value: 'rules',
						title: 'How are contributions split?',
						content:
							'Each revenue is shared between the destinations of your split rule, as soon as it arrives.',
					},
					{
						value: 'votes',
						title: 'Who can vote?',
						content:
							'Only the members chosen when the vote is created, before the deadline.',
					},
					{ value: 'locked', title: 'Locked section', content: '', disabled: true },
				]}
			/>
			<div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
				<div className="border-border h-[30rem] overflow-hidden rounded-xl border">
					<Sidebar
						className="w-full border-e-0"
						header={<span className="font-heading text-lg font-semibold">Gereo</span>}
						footer={
							<div className="flex items-center gap-2 text-sm">
								<Avatar name="Nekena Rabeharivonjy" size="sm" />
								<span className="truncate">Nekena</span>
							</div>
						}
						sections={[
							{
								items: [
									{
										id: 'home',
										hash: 'home',
										label: 'Overview',
										icon: HouseIcon,
										to: '/',
									},
									{
										id: 'wallets',
										hash: 'wallets',
										label: 'Wallets',
										icon: WalletIcon,
										to: '/',
									},
									{
										id: 'projects',
										hash: 'projects',
										label: 'Projects',
										icon: FolderKanbanIcon,
										to: '/',
									},
								],
							},
							{
								title: 'Group',
								items: [
									{
										id: 'votes',
										hash: 'votes',
										label: 'Votes',
										icon: VoteIcon,
										to: '/',
										badge: (
											<Badge variant="primary" size="sm">
												2
											</Badge>
										),
									},
									{
										id: 'events',
										hash: 'events',
										label: 'Events',
										icon: CalendarDaysIcon,
										to: '/',
									},
									{
										id: 'journal',
										hash: 'journal',
										label: 'Journal',
										icon: LayoutListIcon,
										to: '/',
									},
								],
							},
						]}
					/>
				</div>
				<div className="border-border flex h-[30rem] flex-col justify-end overflow-hidden rounded-xl border">
					<div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 text-sm">
						<RowsIcon aria-hidden="true" className="size-4" /> Page content
					</div>
					<BottomNav
						items={[
							{ id: 'home', hash: 'home', label: 'Home', icon: HouseIcon, to: '/' },
							{
								id: 'wallets',
								hash: 'wallets',
								label: 'Wallets',
								icon: WalletIcon,
								to: '/',
							},
							{ id: 'votes', hash: 'votes', label: 'Votes', icon: VoteIcon, to: '/' },
							{
								id: 'events',
								hash: 'events',
								label: 'Events',
								icon: CalendarDaysIcon,
								to: '/',
							},
						]}
					/>
				</div>
			</div>
		</div>
	)
}

const HomePage = () => (
	<main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-6 py-16">
		<div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
			<div className="space-y-2">
				<h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance">
					{env.appName}
				</h1>
				<p className="text-muted-foreground text-pretty">
					React, TanStack Router, TanStack Query and Tailwind CSS on the client. NestJS,
					Prisma, PostgreSQL and Redis on the server.
				</p>
			</div>
			<ThemeToggle />
		</div>

		<Section title="Colors">
			<div className="flex flex-wrap gap-3">
				{swatches.map((swatch) => (
					<div key={swatch} className="space-y-1">
						<div className={`${swatch} border-border size-12 rounded-lg border`} />
						<p className="text-muted-foreground text-xs">{swatch.slice(3)}</p>
					</div>
				))}
			</div>
		</Section>

		<Section title="Variants × sizes">
			<div className="space-y-3">
				{variants.map((variant) => (
					<div key={variant} className="flex flex-wrap items-center gap-3">
						<span className="text-muted-foreground w-20 text-xs">{variant}</span>
						{sizes.map((size) => (
							<Button key={size} variant={variant} size={size}>
								{size}
							</Button>
						))}
						{iconSizes.map((size) => (
							<Button key={size} variant={variant} size={size} aria-label={size}>
								<PlusIcon />
							</Button>
						))}
					</div>
				))}
			</div>
		</Section>

		<Section title="Input">
			<div className="space-y-4">
				<div className="grid gap-3 sm:grid-cols-3">
					{inputSizes.map((size) => (
						<Input
							key={size}
							size={size}
							label={`Size ${size}`}
							placeholder="Placeholder"
						/>
					))}
				</div>
				<InputIconDemos />
				<div className="grid gap-3 sm:grid-cols-2">
					<Input
						type="email"
						label="Email"
						info="We only use it to send receipts."
						placeholder="you@example.com"
						required
					/>
					<Input label="Name" defaultValue="" error="This field is required." required />
					<Input label="Disabled" defaultValue="Disabled" disabled />
					<Input label="Read only" defaultValue="Read only" readOnly />
					<Input aria-label="Without label" placeholder="Without label" />
				</div>
			</div>
		</Section>

		<Section title="Form controls">
			<div className="grid gap-6 sm:grid-cols-2">
				<Textarea
					label="Message"
					placeholder="Write something"
					info="Grows with its content."
				/>
				<div className="space-y-4">
					<Combobox
						label="Country"
						placeholder="Search a country"
						items={countries}
						defaultValue="mg"
						clearable
					/>
					<Combobox
						label="Plan"
						placeholder="Select a plan"
						items={plans}
						error="Choose a plan."
						required
					/>
				</div>
				<div className="space-y-3">
					<Checkbox label="Accept the terms" defaultChecked />
					<Checkbox label="Subscribe to the newsletter" info="One email a month." />
					<Checkbox label="Required" error="You must accept." />
					<Checkbox label="Disabled" disabled />
				</div>
				<div className="space-y-3">
					<Radio name="plan" label="Monthly" defaultChecked />
					<Radio name="plan" label="Yearly" />
					<Radio name="plan" label="Disabled" disabled />
					<Switch label="Notifications" defaultChecked />
					<Switch label="Marketing emails" />
					<Switch label="Disabled" disabled />
				</div>
			</div>
		</Section>

		<Section title="Overlays">
			<div className="flex flex-wrap items-center gap-3">
				<Dialog
					trigger={<Button variant="secondary">Open dialog</Button>}
					title="Edit profile"
					description="Make changes to your profile here."
					footer={
						<Button
							onClick={() => toast.success('Profile saved', 'Your changes are live.')}
						>
							Save changes
						</Button>
					}
				>
					<Input label="Name" defaultValue="Nekena" />
				</Dialog>
				<AlertDialog
					trigger={<Button variant="destructive">Delete account</Button>}
					title="Delete your account?"
					description="This action cannot be undone. All your data will be removed."
					confirmLabel="Delete"
					onConfirm={() => toast.error('Account deleted')}
				/>
				<Tooltip content="Edit">
					<Button variant="outline" size="icon" aria-label="Edit">
						<PencilIcon />
					</Button>
				</Tooltip>
				<Tooltip content="Delete this item">
					<Button variant="outline" size="icon" aria-label="Delete">
						<TrashIcon />
					</Button>
				</Tooltip>
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<Button
					variant="outline"
					onClick={() => toast.show('Notification', 'Something happened.')}
				>
					Toast
				</Button>
				<Button
					variant="outline"
					onClick={() => toast.success('Saved', 'Your changes were saved.')}
				>
					Success
				</Button>
				<Button
					variant="outline"
					onClick={() => toast.error('Failed', 'Something went wrong.')}
				>
					Error
				</Button>
				<Button
					variant="outline"
					onClick={() => toast.info('Heads up', 'A new version is available.')}
				>
					Info
				</Button>
			</div>
		</Section>

		<Section title="Card, badge, skeleton">
			<div className="grid gap-4 sm:grid-cols-2">
				<Card
					title="Monthly plan"
					description="Billed every month."
					footer={
						<>
							<Button size="sm">Upgrade</Button>
							<Button size="sm" variant="ghost">
								Details
							</Button>
						</>
					}
					className="shadow-sm"
				>
					<div className="flex flex-wrap gap-2">
						<Badge>Neutral</Badge>
						<Badge variant="primary">Primary</Badge>
						<Badge variant="success">Active</Badge>
						<Badge variant="destructive">Overdue</Badge>
						<Badge variant="outline" size="sm">
							Outline
						</Badge>
					</div>
				</Card>
				<Card title="Loading" description="Skeleton placeholders.">
					<div className="flex items-center gap-3">
						<Skeleton className="size-10 rounded-full" />
						<div className="flex flex-1 flex-col gap-2">
							<Skeleton className="h-3 w-2/3" />
							<Skeleton className="h-3 w-1/2" />
						</div>
					</div>
					<Skeleton className="h-20 w-full rounded-lg" />
				</Card>
			</div>
		</Section>

		<Section title="Onboarding">
			<OnboardingDemos />
		</Section>

		<Section title="Money">
			<MoneyDemos />
		</Section>

		<Section title="Charts">
			<ChartDemos />
		</Section>

		<Section title="Date and calendar">
			<DateDemos />
		</Section>

		<Section title="Governance and layout">
			<GovernanceDemos />
		</Section>

		<Section title="Navigation">
			<NavigationDemos />
		</Section>

		<Section title="Data">
			<DataDemos />
		</Section>

		<Section title="Loading">
			<div className="flex flex-wrap items-center gap-3">
				{variants.map((variant) => (
					<Button key={variant} variant={variant} loading>
						Saving
					</Button>
				))}
				{iconSizes.map((size) => (
					<Button key={size} size={size} loading aria-label={size} />
				))}
			</div>
		</Section>

		<Section title="Disabled">
			<div className="flex flex-wrap items-center gap-3">
				{variants.map((variant) => (
					<Button key={variant} variant={variant} disabled>
						Disabled
					</Button>
				))}
			</div>
		</Section>
	</main>
)

export const Route = createFileRoute('/')({
	component: HomePage,
})
