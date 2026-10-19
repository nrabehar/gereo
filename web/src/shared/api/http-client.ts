import type { z } from 'zod'

import { env } from '$config/env'

export class HttpError extends Error {
	readonly status: number
	readonly body: unknown

	constructor(status: number, body: unknown) {
		super(`Request failed with status ${status}`)
		this.name = 'HttpError'
		this.status = status
		this.body = body
	}
}

type RequestOptions<TSchema extends z.ZodType> = Omit<RequestInit, 'body'> & {
	schema: TSchema
	body?: unknown
	query?: Record<string, string | number | boolean | undefined>
}

const buildUrl = (path: string, query?: RequestOptions<z.ZodType>['query']) => {
	const base = `${env.apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
	if (!query) return base
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value))
	}
	const search = params.toString()
	return search ? `${base}?${search}` : base
}

const parseBody = async (response: Response): Promise<unknown> => {
	if (response.status === 204) return undefined
	const contentType = response.headers.get('content-type') ?? ''
	return contentType.includes('application/json') ? response.json() : response.text()
}

export const request = async <TSchema extends z.ZodType>(
	path: string,
	{ schema, body, query, headers, ...init }: RequestOptions<TSchema>,
): Promise<z.infer<TSchema>> => {
	const requestHeaders = new Headers(headers)
	if (!requestHeaders.has('Accept')) requestHeaders.set('Accept', 'application/json')
	if (body !== undefined && !requestHeaders.has('Content-Type')) {
		requestHeaders.set('Content-Type', 'application/json')
	}

	const response = await fetch(buildUrl(path, query), {
		credentials: 'include',
		...init,
		headers: requestHeaders,
		body: body === undefined ? undefined : JSON.stringify(body),
	})

	const payload = await parseBody(response)

	if (!response.ok) {
		throw new HttpError(response.status, payload)
	}

	return schema.parse(payload)
}

export const http = {
	get: <TSchema extends z.ZodType>(
		path: string,
		options: Omit<RequestOptions<TSchema>, 'method' | 'body'>,
	) => request(path, { ...options, method: 'GET' }),
	post: <TSchema extends z.ZodType>(
		path: string,
		options: Omit<RequestOptions<TSchema>, 'method'>,
	) => request(path, { ...options, method: 'POST' }),
	put: <TSchema extends z.ZodType>(
		path: string,
		options: Omit<RequestOptions<TSchema>, 'method'>,
	) => request(path, { ...options, method: 'PUT' }),
	patch: <TSchema extends z.ZodType>(
		path: string,
		options: Omit<RequestOptions<TSchema>, 'method'>,
	) => request(path, { ...options, method: 'PATCH' }),
	delete: <TSchema extends z.ZodType>(
		path: string,
		options: Omit<RequestOptions<TSchema>, 'method'>,
	) => request(path, { ...options, method: 'DELETE' }),
}
