# Architecture

Both apps are organised by **feature (domain)**, not by technical layer. A feature owns its code end to end, so it can grow, move or be deleted as one folder. Shared code only flows downward.

## Web

```
web/src
├── app/             application shell: providers, router, query client
├── routes/          file-based routes (TanStack Router), thin: compose features
├── features/        one folder per business domain
│   └── <feature>/
│       ├── api/         query options, mutations, Zod schemas, query keys
│       ├── components/  UI owned by the feature
│       ├── hooks/
│       └── index.ts     public API of the feature
├── shared/          domain-agnostic building blocks
│   ├── api/         HTTP client
│   ├── config/      validated environment
│   ├── lib/         utilities
│   └── ui/          design-system primitives
└── styles/          Tailwind entry and design tokens
```

Rules:

- Dependency direction: `routes → features → shared`. `shared` never imports from `features`; `app` wires everything.
- A feature is imported only through its `index.ts`. Features do not import each other; compose them in routes.
- Server state lives in TanStack Query (`queryOptions` factories + hierarchical query keys). Client state stays local or in the URL (typed search params).
- Every API response is parsed with Zod at the boundary.
- Route files may use `loader` + `queryClient.ensureQueryData` for preloading; code splitting is automatic.
- Files prefixed with `-` inside `routes/` are ignored by the router and can colocate route-only components.

Path aliases (`web/tsconfig.app.json`, resolved by Vite and Vitest through `resolve.tsconfigPaths`):

| Alias        | Target                | Example                                   |
| ------------ | --------------------- | ----------------------------------------- |
| `#/*`        | `src/features/*`      | `import { ApiStatus } from '#/system'`    |
| `@ui/*`      | `src/shared/ui/*`     | `import { Button } from '@ui/button'`     |
| `$/*`        | `src/shared/lib/*`    | `import { cn } from '$/cn'`               |
| `$api/*`     | `src/shared/api/*`    | `import { http } from '$api/http-client'` |
| `$config/*`  | `src/shared/config/*` | `import { env } from '$config/env'`       |
| `@/*`        | `src/*`               | `import { App } from '@/app/app'`         |

Inside a feature, imports stay relative (`../api/health`). From outside, a feature is imported through its root (`#/system`), never a deep path.

## API

```
api/src
├── main.ts                 bootstrap
├── app.module.ts           composition root
├── bootstrap/              HTTP setup: security, CORS, versioning, validation, Swagger
├── config/                 Zod-validated environment + typed AppConfigService
├── core/                   infrastructure, imported once by AppModule
│   ├── database/           PrismaService (driver adapter pg)
│   ├── redis/              Redis client provider
│   ├── logger/             Pino structured logging, request ids
│   └── health/             liveness and readiness probes
├── common/                 cross-cutting: filters, DTOs, guards, decorators, interceptors
├── modules/                business domains
│   └── <domain>/
│       ├── dto/
│       ├── <domain>.controller.ts   HTTP only, no business logic
│       ├── <domain>.service.ts      use cases
│       ├── <domain>.repository.ts   persistence, the only layer touching Prisma
│       ├── <domain>.module.ts       exports only what other domains may use
│       └── *.spec.ts
└── generated/prisma        Prisma client output (git-ignored)
```

Rules:

- One Nest module per **business domain**, not per table.
- Domains talk to each other through exported services, never through another domain's repository. Prefer events for loose coupling once flows cross several domains.
- Controllers map HTTP ↔ DTOs; services hold rules; repositories hold queries. Responses go through response DTOs, never raw Prisma models.
- `core` modules are global infrastructure; `common` contains pure, reusable pieces.
- Routes are prefixed with `/api` and URI-versioned (`/api/v1/...`). Health endpoints are version-neutral.
- Configuration is read only through `AppConfigService`; the process refuses to start on invalid environment.
- When a domain becomes large or needs independent deployment, it can move to its own Nest app with minimal changes, because its boundary is already explicit.

Path aliases (`api/tsconfig.json`). `nest build` rewrites them to relative paths in `dist`, and Vitest resolves them through `resolve.tsconfigPaths`. Imports keep the `.js` extension required by ESM:

| Alias        | Target                    | Example                                                       |
| ------------ | ------------------------- | ------------------------------------------------------------- |
| `#/*`        | `src/modules/*`           | `import { UsersModule } from '#/users/users.module.js'`       |
| `@core/*`    | `src/core/*`              | `import { PrismaService } from '@core/database/prisma.service.js'` |
| `@common/*`  | `src/common/*`            | `import { PaginationQueryDto } from '@common/dto/pagination.dto.js'` |
| `$config/*`  | `src/config/*`            | `import { AppConfigService } from '$config/app-config.service.js'` |
| `$prisma/*`  | `src/generated/prisma/*`  | `import type { User } from '$prisma/client.js'`               |
| `@/*`        | `src/*`                   | `import { AppModule } from '@/app.module.js'`                 |

Files in the same folder or its subfolders use relative imports (`./dto/create-user.dto.js`).

## Scaling path

1. Modular monolith (current): strict module boundaries, one deployable.
2. Add workers (queues on Redis) as a second Nest app in the same repo for background jobs.
3. Extract shared contracts (DTO schemas, OpenAPI client) to a workspace package consumed by `web`.
4. Split a domain into a service only when its load or team ownership requires it.
