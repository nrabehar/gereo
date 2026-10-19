import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Button } from '@ui/button'

export const RouteError = ({ error }: ErrorComponentProps) => {
	const router = useRouter()
	const { reset } = useQueryErrorResetBoundary()

	useEffect(() => {
		reset()
	}, [reset])

	return (
		<main
			role="alert"
			className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center"
		>
			<h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
			<p className="text-muted-foreground">
				{error instanceof Error ? error.message : 'An unexpected error occurred.'}
			</p>
			<Button onClick={() => router.invalidate()}>Try again</Button>
		</main>
	)
}
