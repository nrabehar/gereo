import { CheckIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '$/cn'

type StepperStep = {
	label: string
	description?: ReactNode
}

type StepperProps = {
	steps: StepperStep[]
	current: number
	className?: string
}

export const Stepper = ({ steps, current, className }: StepperProps) => (
	<ol className={cn('flex w-full items-start', className)}>
		{steps.map((step, index) => {
			const complete = index < current
			const isCurrent = index === current
			const isLast = index === steps.length - 1

			return (
				<li
					key={step.label}
					aria-current={isCurrent ? 'step' : undefined}
					className={cn('flex min-w-0 items-start', !isLast && 'flex-1')}
				>
					<div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:gap-3">
						<span
							className={cn(
								'grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums ring-1 transition-[background-color,color] duration-200 ease-out-strong ring-inset',
								complete && 'bg-primary text-primary-foreground ring-primary',
								isCurrent && 'bg-background text-foreground ring-foreground ring-2',
								!complete &&
									!isCurrent &&
									'bg-muted text-muted-foreground ring-border',
							)}
						>
							{complete ? (
								<CheckIcon aria-hidden="true" className="size-4" strokeWidth={3} />
							) : (
								index + 1
							)}
						</span>
						<span className="flex min-w-0 flex-col text-center sm:text-start">
							<span
								className={cn(
									'text-sm leading-tight font-medium',
									!complete && !isCurrent && 'text-muted-foreground',
								)}
							>
								{step.label}
								<span className="sr-only">
									{complete ? ' (completed)' : isCurrent ? ' (current step)' : ''}
								</span>
							</span>
							{step.description && (
								<span className="text-muted-foreground hidden text-xs sm:block">
									{step.description}
								</span>
							)}
						</span>
					</div>
					{!isLast && (
						<span
							aria-hidden="true"
							className={cn(
								'mx-3 mt-4 h-px min-w-4 flex-1 transition-colors duration-200 ease-out-strong',
								complete ? 'bg-primary' : 'bg-border',
							)}
						/>
					)}
				</li>
			)
		})}
	</ol>
)
