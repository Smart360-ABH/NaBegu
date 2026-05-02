# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### НаБегу — Быстрое питание (`artifacts/nabegu`)
- React + Vite web app at preview path `/`
- Fast food restaurant website for "НаБегу" in Abkhazia
- Pages: Home (landing), Menu (with categories + cart), Order (checkout), Contact (Yandex Maps)
- Back4App integration via REST API (no Parse SDK — uses fetch directly)
- Demo menu data fallback when Back4App is not configured
- Cart state managed via React Context

### Back4App Configuration
- Set `VITE_BACK4APP_APP_ID` and `VITE_BACK4APP_JS_KEY` env vars in the Secrets tab
- Get these from: https://dashboard.back4app.com → your app → Settings → Security & Keys
- Back4App classes needed: `MenuItem` (name, description, price, category, imageUrl, isAvailable) and `Order` (customerName, customerPhone, items, total, status)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
