# Gereo

Monorepo with two applications:

| App   | Stack                                                                       | Path           |
| ----- | --------------------------------------------------------------------------- | -------------- |
| `web` | React 19, Vite 8, TanStack Router + Query, Tailwind CSS 4, Zod 4             | [web/](web/)   |
| `api` | NestJS 12 (ESM), Prisma 7 (driver adapter `pg`), PostgreSQL 18, Redis 8      | [api/](api/)   |

Tooling: TypeScript 6, Oxlint (type-aware), Oxfmt, Vitest. Node.js 24 LTS.

See [docs/architecture.md](docs/architecture.md) for folder conventions and module boundaries.

## Development (Docker, hot reload)

```bash
cp .env.example .env
docker compose -f compose.dev.yaml up --build --watch
```

| URL                            | Service                         |
| ------------------------------ | ------------------------------- |
| http://localhost:8080          | nginx proxy (web + `/api`)      |
| http://localhost:5173          | Vite dev server                 |
| http://localhost:3000/api/docs | Swagger UI                      |
| localhost:9229                 | Node inspector (api)            |
| localhost:5432 / 6379          | PostgreSQL / Redis              |

Hot reload uses [Compose Watch](https://docs.docker.com/compose/how-tos/file-watch/): source files are synced into the containers, so file events work on Windows, macOS and Linux without polling. Changing `package.json` or `package-lock.json` rebuilds the image; changing `api/prisma/*` regenerates the Prisma client.

Generated code (`web/src/routeTree.gen.ts`, `api/src/generated/`) lives inside the containers. For editor type checking on the host, run once per app:

```bash
cd web && npm ci && npm run typecheck
cd api && npm ci && npm run prisma:generate
```

### Database migrations (development)

```bash
docker compose -f compose.dev.yaml exec api npm run prisma:migrate:dev -- --name <change>
```

## Production (API only)

```bash
cp .env.example .env
docker compose -f compose.prod.yaml up -d --build
```

Services: `nginx` (reverse proxy, rate limiting, JSON access logs) → `api` (read-only filesystem, non-root, tini) → `postgres` + `redis` on an internal network. The one-shot `migrate` service runs `prisma migrate deploy` before the API starts. Scale the API with `API_REPLICAS`.

The web app ships as a static image (`web/Dockerfile`, target `production`) served by unprivileged nginx with SPA fallback, immutable asset caching and security headers.

## Scripts

| Command                   | web | api |
| ------------------------- | --- | --- |
| `npm run dev` / `start:dev` | ✓ | ✓ |
| `npm run build`           | ✓   | ✓   |
| `npm run typecheck`       | ✓   | ✓   |
| `npm run lint`            | ✓   | ✓   |
| `npm run format`          | ✓   | ✓   |
| `npm test`                | ✓   | ✓   |
| `npm run test:e2e`        |     | ✓   |
