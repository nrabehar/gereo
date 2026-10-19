import { useQuery } from '@tanstack/react-query'

import { healthQueryOptions } from '../api/health'
import { cn } from '$/cn'

export const ApiStatus = () => {
	const { data, isPending, isError } = useQuery(healthQueryOptions())

	const healthy = data?.status === 'ok'
	const label = isPending ? 'Checking API' : healthy ? 'API operational' : 'API unavailable'
	const services = Object.entries(data?.details ?? {})

	return (
		<section
			aria-live="polite"
			className="w-full rounded-2xl bg-muted p-5 ring-1 ring-border ring-inset"
		>
			<div className="flex items-center gap-3">
				<span
					aria-hidden
					className={cn(
						'size-2.5 rounded-full',
						isPending && 'animate-pulse bg-muted-foreground',
						!isPending && healthy && 'bg-emerald-500',
						!isPending && (!healthy || isError) && 'bg-destructive',
					)}
				/>
				<p className="text-sm font-medium">{label}</p>
			</div>
			{services.length > 0 && (
				<ul className="mt-4 grid gap-2 text-sm">
					{services.map(([name, indicator]) => (
						<li key={name} className="flex items-center justify-between">
							<span className="text-muted-foreground capitalize">{name}</span>
							<span
								className={
									indicator.status === 'up'
										? 'text-emerald-600 dark:text-emerald-400'
										: 'text-destructive dark:text-red-400'
								}
							>
								{indicator.status}
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}
