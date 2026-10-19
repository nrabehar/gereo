import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '$/cn'

const moneyVariants = cva('whitespace-nowrap', {
	variants: {
		size: {
			sm: 'text-sm tabular-nums',
			md: 'text-base tabular-nums',
			lg: 'font-heading text-2xl font-semibold tracking-[-0.01em]',
			xl: 'font-heading text-4xl leading-[1.05] font-semibold tracking-[-0.02em]',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

type MoneyProps = VariantProps<typeof moneyVariants> & {
	amount: number
	currency?: string
	locale?: string
	signDisplay?: Intl.NumberFormatOptions['signDisplay']
	colored?: boolean
	className?: string
}

const formatMoney = (
	amount: number,
	currency: string,
	locale: string,
	signDisplay: Intl.NumberFormatOptions['signDisplay'],
) => {
	if (currency === 'MGA') {
		const number = new Intl.NumberFormat(locale, {
			maximumFractionDigits: 0,
			signDisplay,
		}).format(amount)

		return `${number} Ar`
	}

	return new Intl.NumberFormat(locale, { style: 'currency', currency, signDisplay }).format(
		amount,
	)
}

export const Money = ({
	amount,
	currency = 'MGA',
	locale = 'fr-FR',
	signDisplay,
	colored = false,
	size,
	className,
}: MoneyProps) => (
	<span
		className={cn(
			moneyVariants({ size }),
			colored && amount > 0 && 'text-emerald-700 dark:text-emerald-400',
			colored && amount < 0 && 'text-red-700 dark:text-red-400',
			className,
		)}
	>
		{formatMoney(amount, currency, locale, signDisplay ?? (colored ? 'exceptZero' : 'auto'))}
	</span>
)
