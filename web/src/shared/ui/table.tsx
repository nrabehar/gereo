import type { ReactNode } from 'react'

import { cn } from '$/cn'

type TableColumn<Row> = {
	key: string
	header: ReactNode
	renderCell: (row: Row) => ReactNode
	align?: 'start' | 'center' | 'end'
	className?: string
}

type TableProps<Row> = {
	columns: TableColumn<Row>[]
	rows: Row[]
	getRowKey: (row: Row) => string
	caption?: string
	emptyText?: string
	className?: string
}

const alignments = {
	start: 'text-start',
	center: 'text-center',
	end: 'text-end',
}

export const Table = <Row,>({
	columns,
	rows,
	getRowKey,
	caption,
	emptyText = 'No results.',
	className,
}: TableProps<Row>) => (
	<div className={cn('border-border overflow-x-auto rounded-xl border', className)}>
		<table className="w-full border-collapse text-sm">
			{caption && <caption className="sr-only">{caption}</caption>}
			<thead>
				<tr className="bg-muted/50">
					{columns.map((column) => (
						<th
							key={column.key}
							scope="col"
							className={cn(
								'text-muted-foreground px-4 py-3 text-xs font-medium tracking-[0.04em] whitespace-nowrap uppercase',
								alignments[column.align ?? 'start'],
							)}
						>
							{column.header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.length === 0 ? (
					<tr>
						<td
							colSpan={columns.length}
							className="text-muted-foreground border-border border-t px-4 py-10 text-center"
						>
							{emptyText}
						</td>
					</tr>
				) : (
					rows.map((row) => (
						<tr
							key={getRowKey(row)}
							className="border-border hover:bg-muted/50 border-t transition-colors duration-150"
						>
							{columns.map((column) => (
								<td
									key={column.key}
									className={cn(
										'px-4 py-3 align-middle',
										alignments[column.align ?? 'start'],
										column.className,
									)}
								>
									{column.renderCell(row)}
								</td>
							))}
						</tr>
					))
				)}
			</tbody>
		</table>
	</div>
)
