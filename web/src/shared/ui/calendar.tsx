import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { cn } from '$/cn'
import { Button } from '@ui/button'

type CalendarProps = {
	value?: Date | null
	defaultValue?: Date | null
	onValueChange?: (value: Date) => void
	min?: Date
	max?: Date
	locale?: string
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	focusOnMount?: boolean
	className?: string
}

const WEEK_INDEXES = [0, 1, 2, 3, 4, 5]
const DAY_INDEXES = [0, 1, 2, 3, 4, 5, 6]

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date: Date, days: number) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const addMonths = (date: Date, months: number) => {
	const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
	const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()

	return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}

const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
	Boolean(a && b) &&
	a?.getFullYear() === b?.getFullYear() &&
	a?.getMonth() === b?.getMonth() &&
	a?.getDate() === b?.getDate()

const toKey = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const Calendar = ({
	value,
	defaultValue = null,
	onValueChange,
	min,
	max,
	locale = 'fr-FR',
	weekStartsOn = 1,
	focusOnMount = false,
	className,
}: CalendarProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const moveFocus = useRef(focusOnMount)
	const [internal, setInternal] = useState<Date | null>(defaultValue)
	const selected = value === undefined ? internal : value
	const [today] = useState(() => startOfDay(new Date()))
	const [focused, setFocused] = useState(() => startOfDay(selected ?? today))

	useEffect(() => {
		if (moveFocus.current) {
			moveFocus.current = false
			containerRef.current
				?.querySelector<HTMLButtonElement>(`[data-date="${toKey(focused)}"]`)
				?.focus()
		}
	}, [focused])

	const isDisabled = (date: Date) =>
		Boolean((min && date < startOfDay(min)) || (max && date > startOfDay(max)))

	const monthStart = new Date(focused.getFullYear(), focused.getMonth(), 1)
	const offset = (monthStart.getDay() - weekStartsOn + 7) % 7
	const gridStart = addDays(monthStart, -offset)
	const weeks = WEEK_INDEXES.map((week) =>
		DAY_INDEXES.map((day) => addDays(gridStart, week * 7 + day)),
	)

	const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
		monthStart,
	)
	const fullLabel = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })
	const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
	const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' })
	const weekdays = DAY_INDEXES.map((index) => {
		const date = addDays(gridStart, index)

		return { key: index, short: weekdayShort.format(date), long: weekdayLong.format(date) }
	})

	const focusDate = (date: Date) => {
		moveFocus.current = true
		setFocused(date)
	}

	const select = (date: Date) => {
		if (isDisabled(date)) {
			return
		}

		setInternal(date)
		setFocused(date)
		onValueChange?.(date)
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
		const next: Record<string, Date> = {
			ArrowLeft: addDays(date, -1),
			ArrowRight: addDays(date, 1),
			ArrowUp: addDays(date, -7),
			ArrowDown: addDays(date, 7),
			PageUp: addMonths(date, event.shiftKey ? -12 : -1),
			PageDown: addMonths(date, event.shiftKey ? 12 : 1),
			Home: addDays(date, -((date.getDay() - weekStartsOn + 7) % 7)),
			End: addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7)),
		}
		const target = next[event.key]

		if (target) {
			event.preventDefault()
			focusDate(target)
		}
	}

	return (
		<div ref={containerRef} className={cn('w-72 select-none', className)}>
			<div className="mb-2 flex items-center justify-between">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Previous month"
					onClick={() => setFocused(addMonths(focused, -1))}
				>
					<ChevronLeftIcon />
				</Button>
				<p aria-live="polite" className="font-heading text-sm font-semibold capitalize">
					{monthLabel}
				</p>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Next month"
					onClick={() => setFocused(addMonths(focused, 1))}
				>
					<ChevronRightIcon />
				</Button>
			</div>
			<table className="w-full border-collapse">
				<thead>
					<tr>
						{weekdays.map((weekday) => (
							<th
								key={weekday.key}
								scope="col"
								abbr={weekday.long}
								className="text-muted-foreground size-9 text-xs font-medium"
							>
								{weekday.short}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{weeks.map((week) => (
						<tr key={toKey(week[0] ?? gridStart)}>
							{week.map((date) => {
								const isSelected = isSameDay(date, selected)
								const outside = date.getMonth() !== focused.getMonth()

								return (
									<td key={toKey(date)} className="p-0 text-center">
										<button
											type="button"
											data-date={toKey(date)}
											tabIndex={isSameDay(date, focused) ? 0 : -1}
											disabled={isDisabled(date)}
											aria-label={fullLabel.format(date)}
											aria-pressed={isSelected}
											aria-current={
												isSameDay(date, today) ? 'date' : undefined
											}
											onClick={() => select(date)}
											onKeyDown={(event) => handleKeyDown(event, date)}
											className={cn(
												'focus-visible:outline-foreground size-9 cursor-pointer rounded-lg text-sm tabular-nums transition-[color,background-color,scale] duration-150 ease-out-strong outline-none focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-40 motion-safe:active:scale-95',
												!isSelected && 'hover:bg-muted active:bg-accent',
												outside && !isSelected && 'text-muted-foreground',
												isSameDay(date, today) &&
													!isSelected &&
													'ring-foreground/40 font-semibold ring-1 ring-inset',
												isSelected &&
													'bg-primary text-primary-foreground font-semibold',
											)}
										>
											{date.getDate()}
										</button>
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
