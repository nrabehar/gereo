import { QueryClient } from '@tanstack/react-query'

import { HttpError } from '$api/http-client'

const shouldRetry = (failureCount: number, error: unknown) => {
	if (error instanceof HttpError && error.status >= 400 && error.status < 500) return false
	return failureCount < 2
}

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 30_000,
				gcTime: 5 * 60_000,
				retry: shouldRetry,
				refetchOnWindowFocus: false,
			},
			mutations: {
				retry: false,
			},
		},
	})
