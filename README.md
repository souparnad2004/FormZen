# Form Builder

Production-oriented monorepo with a Vite web app, Express/tRPC API, shared schema packages, and Drizzle/Postgres.

## Local Setup

1. Install Node 20+ and pnpm via Corepack:

```bash
corepack enable
corepack prepare pnpm@11.3.0 --activate
pnpm install
```

2. Create `.env` from `.env.example` and fill the values.

3. Run database migrations:

```bash
pnpm db:migrate
```

4. Start development:

```bash
pnpm dev
```

## Production Commands

API service:

```bash
pnpm build:api
pnpm start:api
```

Web service:

```bash
pnpm build:web
pnpm start:web
```

The web build requires `VITE_API_URL` in production because Vite embeds it at build time.

## Railway Deployment

Deploy this as two Railway services from the same GitHub repo. Set the build and start commands separately for each service in Railway's service settings.

### 1. Create Postgres

Add a Railway Postgres database. Copy its `DATABASE_URL` into the API service variables, or use Railway's variable reference for the Postgres connection.

### 2. Deploy API Service

Create a service from the repo and use these settings:

- Build command: `pnpm build:api`
- Start command: `pnpm start:api`
- Variables:
  - `DATABASE_URL`: Railway Postgres URL
  - `JWT_SECRET`: at least 32 random characters
  - `CORS_ORIGIN`: your deployed web URL, for example `https://your-web.up.railway.app`
  - `NODE_ENV`: `production`

After the first successful deploy, run migrations in the API service shell:

```bash
pnpm db:migrate
```

Check `https://your-api.up.railway.app/health`; it should return `{ "status": "ok" }`.

### 3. Deploy Web Service

Create a second service from the same repo:

- Build command: `pnpm build:web`
- Start command: `pnpm start:web`
- Variables:
  - `VITE_API_URL`: your deployed API URL, for example `https://your-api.up.railway.app`
  - `NODE_ENV`: `production`

Redeploy the web service after setting `VITE_API_URL`; Vite only reads it during build.

### Common Railway Fixes

- `Missing script: start`: set the service start command to `pnpm start:api` or `pnpm start:web`.
- Web calls `localhost:3000`: set `VITE_API_URL` on the web service and redeploy.
- Login works locally but not on Railway: set API `CORS_ORIGIN` to the exact web URL, including `https://`, and redeploy the API.
- `Invalid env JWT_SECRET`: use a secret with at least 32 characters.
- Database errors on boot: confirm `DATABASE_URL` is present on the API service and run `pnpm db:migrate`.
