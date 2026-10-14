import { createFileRoute } from '@tanstack/react-router'

import { ApiStatus } from '#/system'
import { env } from '$config/env'

const HomePage = () => (
  <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-6 px-6">
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-balance">{env.appName}</h1>
      <p className="text-fg-muted text-pretty">
        React, TanStack Router, TanStack Query and Tailwind CSS on the client. NestJS, Prisma,
        PostgreSQL and Redis on the server.
      </p>
    </div>
    <ApiStatus />
  </main>
)

export const Route = createFileRoute('/')({
  component: HomePage,
})
