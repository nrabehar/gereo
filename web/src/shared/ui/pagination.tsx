import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@ui/button'

type PaginationProps = {
	page: number
	pageCount: number
	onPageChange: (page: number) => void
	siblings?: number
	className?: string
}

const getPages = (page: number, pageCount: number, siblings: number) => {
	const total = siblings * 2 + 5

	if (pageCount <= total) {
		return Array.from({ length: pageCount }, (_, index) => index + 1)
	}

	const left = Math.max(page - siblings, 2)
	const right = Math.min(page + siblings, pageCount - 1)
	const showLeftGap = left > 2
	const showRightGap = right < pageCount - 1
	const middleStart = showLeftGap ? left : 2
	const middleEnd = showRightGap ? right : pageCount - 1
	const middle = Array.from(
		{ length: middleEnd - middleStart + 1 },
		(_, index) => middleStart + index,
	)

	return [
		1,
		...(showLeftGap ? ['gap-left' as const] : []),
		...middle,
		...(showRightGap ? ['gap-right' as const] : []),
		pageCount,
	]
}

export const Pagination = ({
	page,
	pageCount,
	onPageChange,
	siblings = 1,
	className,
}: PaginationProps) => (
	<nav aria-label="Pagination" className={className}>
		<ul className="flex flex-wrap items-center gap-1">
			<li>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Previous page"
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeftIcon />
				</Button>
			</li>
			{getPages(page, pageCount, siblings).map((item) => (
				<li key={item}>
					{typeof item === 'string' ? (
						<span
							aria-hidden="true"
							className="text-muted-foreground grid size-8 place-items-center"
						>
							…
						</span>
					) : (
						<Button
							variant={item === page ? 'secondary' : 'ghost'}
							size="icon-sm"
							aria-label={`Page ${item}`}
							aria-current={item === page ? 'page' : undefined}
							onClick={() => onPageChange(item)}
							className="tabular-nums"
						>
							{item}
						</Button>
					)}
				</li>
			))}
			<li>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Next page"
					disabled={page >= pageCount}
					onClick={() => onPageChange(page + 1)}
				>
					<ChevronRightIcon />
				</Button>
			</li>
		</ul>
	</nav>
)
