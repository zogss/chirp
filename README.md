# Chirp 🐦

A Twitter clone where you can only post emojis. Built with the [T3 Stack](https://create.t3.gg/).

- Home timeline with infinite scroll, profiles and post pages
- Sign in with [Clerk](https://clerk.com), post from the timeline or from the compose dialog, delete your own posts
- Emoji-only posts with a 280 characters limit (emojis count as 2, like on Twitter), rate limited to 5 posts per minute ([Upstash](https://upstash.com) in production, a local Redis in development)

## Stack

| Layer      | Tech                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19, React Compiler)                                                |
| API        | [tRPC 11](https://trpc.io) with [TanStack Query 5](https://tanstack.com/query)                                                    |
| Database   | PostgreSQL with [Prisma 7](https://prisma.io) (`@prisma/adapter-pg`)                                                              |
| Auth       | [Clerk](https://clerk.com) (`@clerk/nextjs` 7)                                                                                    |
| Rate limit | [Upstash Redis](https://upstash.com) (`@upstash/ratelimit` 2) in production, [Redis](https://redis.io) (`redis` 6) in development |
| UI         | [Tailwind CSS 4](https://tailwindcss.com), [Headless UI 2](https://headlessui.com), [Motion](https://motion.dev)                  |

## Getting started

Requirements: Node.js 22.12+ (see `.nvmrc`), Yarn 4 (`corepack enable`) and Docker.

1. Install dependencies (this also generates the Prisma client):

   ```bash
   yarn install
   ```

2. Create a `.env` file from `.env.example` and add your Clerk keys. The database URL already matches `docker-compose.yml`, and the Upstash variables are only used in production. In the [Clerk dashboard](https://dashboard.clerk.com), make sure **usernames are enabled**, since posts link to their author's profile by username.

3. Start the local services:

   ```bash
   docker compose up -d --build
   ```

   This starts PostgreSQL on port `55432` and Redis on port `6379`. Then a one-off `db-setup` container applies the migrations and, while the database has no posts, seeds it with emoji posts from your Clerk users. Follow it with `docker compose logs -f db-setup`.

   It runs again on every `docker compose up`, so new migrations are applied the same way. `--build` is only needed when dependencies change.

   In development, rate limiting runs against the local Redis instead of Upstash, so you don't need an Upstash database to work on the app.

4. Start the app on [http://localhost:3000](http://localhost:3000):

   ```bash
   yarn dev
   ```

> `.env.local` takes precedence over `.env` (for both Next.js and Prisma), which is handy to point a local copy at the Docker services while `.env` keeps other values.

## Scripts

| Script                      | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `yarn dev`                  | Start the dev server                                     |
| `yarn build` / `yarn start` | Build and serve the production app                       |
| `yarn check`                | Lint and typecheck                                       |
| `yarn format`               | Format with Prettier (also sorts Tailwind classes)       |
| `yarn db:generate`          | Create a migration after changing `prisma/schema.prisma` |
| `yarn db:migrate`           | Apply pending migrations                                 |
| `yarn db:seed`              | Seed random emoji posts (only when there are no posts)   |
| `yarn db:studio`            | Browse the database                                      |

## Project structure

```text
docker/                 image of the db-setup service (migrations and seed)
prisma/                 schema, migrations and seed
src/
  app/                  routes: home, /[username], /post/[id], tRPC handler, loading/not-found/error states
  components/           shared UI: layout columns, navigation, posts, dialogs
  modules/              feature components: posts (composer, feed) and profile
  server/
    api/                tRPC init, context and routers (posts, profile)
    helpers/            joins posts with their Clerk authors
    services/           rate limiter: Upstash in production, local Redis in development
  trpc/                 tRPC clients for client components (react.tsx) and server components (server.tsx)
  utils/                emoji validation and date formatting, shared by client and server
  env.js                validated environment variables
  proxy.ts              Clerk middleware and profile URL redirects
```

## Deploying

Any Next.js host works (e.g. [Vercel](https://create.t3.gg/en/deployment/vercel)). You need:

- A PostgreSQL database (Neon, Supabase, Prisma Postgres, PlanetScale Postgres...). Run `yarn db:migrate` against it before deploying new migrations.
- An [Upstash Redis](https://console.upstash.com) database, for `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. They're required whenever `NODE_ENV` is `production`, so also for a local `yarn build` / `yarn start`.
- A Clerk production instance, for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
