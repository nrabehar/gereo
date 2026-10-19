import type { ChangeEvent, ComponentProps } from 'react'
import { useState } from 'react'

import { Input } from '@ui/input'

type PhoneInputProps = Omit<
	ComponentProps<typeof Input>,
	| 'ref'
	| 'value'
	| 'defaultValue'
	| 'onChange'
	| 'type'
	| 'inputMode'
	| 'startIcon'
	| 'endIcon'
	| 'prefix'
	| 'suffix'
> & {
	value?: string
	defaultValue?: string
	onValueChange?: (digits: string) => void
	prefix?: string
	groups?: number[]
}

const format = (digits: string, groups: number[]) => {
	const parts: string[] = []
	let cursor = 0

	for (const size of groups) {
		if (cursor >= digits.length) {
			break
		}

		parts.push(digits.slice(cursor, cursor + size))
		cursor += size
	}

	return parts.join(' ')
}

export const PhoneInput = ({
	value,
	defaultValue = '',
	onValueChange,
	prefix = '+261',
	groups = [2, 2, 3, 2],
	placeholder = '34 12 345 67',
	...props
}: PhoneInputProps) => {
	const [internal, setInternal] = useState(defaultValue)
	const digits = value === undefined ? internal : value
	const maxLength = groups.reduce((sum, size) => sum + size, 0)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const next = event.target.value.replace(/\D/g, '').slice(0, maxLength)

		setInternal(next)
		onValueChange?.(next)
	}

	return (
		<Input
			{...props}
			type="tel"
			inputMode="tel"
			autoComplete="tel-national"
			prefix={prefix}
			placeholder={placeholder}
			value={format(digits, groups)}
			onChange={handleChange}
			className="tabular-nums"
		/>
	)
}
