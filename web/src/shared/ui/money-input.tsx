import { useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, ComponentProps } from 'react'

import { Input } from '@ui/input'

type MoneyInputProps = Omit<
	ComponentProps<typeof Input>,
	| 'ref'
	| 'value'
	| 'defaultValue'
	| 'onChange'
	| 'type'
	| 'inputMode'
	| 'startIcon'
	| 'endIcon'
	| 'max'
	| 'min'
> & {
	value?: number | null
	defaultValue?: number | null
	onValueChange?: (value: number | null) => void
	locale?: string
	max?: number
}

const countDigits = (text: string) => text.replace(/\D/g, '').length

const caretAfterDigits = (text: string, digits: number) => {
	if (digits <= 0) {
		return 0
	}

	let seen = 0

	for (let index = 0; index < text.length; index += 1) {
		if (/\d/.test(text.charAt(index))) {
			seen += 1

			if (seen === digits) {
				return index + 1
			}
		}
	}

	return text.length
}

export const MoneyInput = ({
	value,
	defaultValue = null,
	onValueChange,
	locale = 'fr-FR',
	max = Number.MAX_SAFE_INTEGER,
	suffix = 'Ar',
	placeholder = '0',
	...props
}: MoneyInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const caretDigits = useRef<number | null>(null)
	const [internal, setInternal] = useState<number | null>(defaultValue)
	const current = value === undefined ? internal : value

	const display = current === null ? '' : new Intl.NumberFormat(locale).format(current)

	useLayoutEffect(() => {
		const input = inputRef.current

		if (input && caretDigits.current !== null && document.activeElement === input) {
			const caret = caretAfterDigits(input.value, caretDigits.current)
			input.setSelectionRange(caret, caret)
		}

		caretDigits.current = null
	})

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const raw = event.target.value
		const digits = raw.replace(/\D/g, '')
		const next = digits === '' ? null : Math.min(Number(digits), max)

		caretDigits.current = countDigits(raw.slice(0, event.target.selectionStart ?? raw.length))
		setInternal(next)
		onValueChange?.(next)
	}

	return (
		<Input
			{...props}
			ref={inputRef}
			inputMode="numeric"
			autoComplete="off"
			placeholder={placeholder}
			suffix={suffix}
			value={display}
			onChange={handleChange}
			className="tabular-nums"
		/>
	)
}
