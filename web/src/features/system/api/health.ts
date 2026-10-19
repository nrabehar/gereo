import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

import { http } from '$api/http-client'

const indicatorSchema = z.record(z.string(), z.object({ status: z.string() }).loose())

export const healthSchema = z.object({
	status: z.enum(['ok', 'error', 'shutting_down']),
	info: indicatorSchema.optional(),
	error: indicatorSchema.optional(),
	details: indicatorSchema.optional(),
})

export type Health = z.infer<typeof healthSchema>

export const systemKeys = {
	all: ['system'] as const,
	health: () => [...systemKeys.all, 'health'] as const,
}

export const healthQueryOptions = () =>
	queryOptions({
		queryKey: systemKeys.health(),
		queryFn: ({ signal }) => http.get('/health', { schema: healthSchema, signal }),
		refetchInterval: 15_000,
		retry: false,
	})
