import { cn } from '$/cn'
import { env } from '$config/env'

type LogoProps = {
	wordmark?: boolean
	className?: string
}

export const Logo = ({ wordmark = true, className }: LogoProps) => (
	<span translate="no" className={cn('inline-flex items-center gap-2.5', className)}>
		<span
			aria-hidden="true"
			className="bg-primary text-primary-foreground font-heading grid size-8 shrink-0 place-items-center rounded-[0.625rem] pb-0.5 text-xl leading-none font-bold"
		>
			{env.appName.charAt(0).toLowerCase()}
		</span>
		{wordmark && (
			<span className="font-heading text-lg leading-none font-semibold tracking-[-0.02em]">
				{env.appName}
			</span>
		)}
	</span>
)
