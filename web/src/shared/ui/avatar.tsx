import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '$/cn'

const avatarVariants = cva(
	'bg-muted text-muted-foreground ring-border inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium ring-1 select-none ring-inset',
	{
		variants: {
			size: {
				sm: 'size-8 text-xs',
				md: 'size-10 text-sm',
				lg: 'size-14 text-base',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)

type AvatarProps = VariantProps<typeof avatarVariants> & {
	name: string
	src?: string
	className?: string
}

const getInitials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join('')

export const Avatar = ({ name, src, size, className }: AvatarProps) => (
	<BaseAvatar.Root className={cn(avatarVariants({ size }), className)}>
		{src && <BaseAvatar.Image src={src} alt={name} className="size-full object-cover" />}
		<BaseAvatar.Fallback delay={src ? 400 : undefined}>
			<span aria-hidden="true">{getInitials(name)}</span>
			<span className="sr-only">{name}</span>
		</BaseAvatar.Fallback>
	</BaseAvatar.Root>
)
