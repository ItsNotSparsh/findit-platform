# FindIt

FindIt is a lost-and-found platform. Users can post lost or found items, submit ownership claims, and coordinate an item’s return.

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project with a Postgres database and Storage

See the [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation) for supported Node.js versions.

## Get the code

```bash
git clone https://github.com/ItsNotSparsh/findit-platform.git
cd findit-platform
npm ci
```

Run these commands from the repository root, where `package.json` is located.

## Configure Supabase

1. Create a Supabase project.
2. Copy the project URL and API keys from **Project Settings → API Keys**.
3. Copy a Postgres connection URI from the project’s **Connect** dialog. Use the Session Pooler for local development if a direct IPv6 connection is unavailable. Use the Transaction Pooler for serverless deployments such as Vercel. Replace the password placeholder with your database password and URL-encode reserved characters in the password.
4. In Supabase Storage, create a bucket named `report-images` and make it public. The app returns public image URLs, so anyone with an image URL can view those images.

Create a `.env` file in the repository root:

```dotenv
DATABASE_URL=your-supabase-postgres-connection-uri
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-secret-key
AUTH_SECRET=your-generated-auth-secret
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is the environment variable name used by this codebase. Put your Supabase **publishable** key in it. Put the **secret** key in `SUPABASE_SERVICE_ROLE_KEY`; this key is used only by server code and must never be exposed in a `NEXT_PUBLIC_` variable or committed to Git.

Generate a value for `AUTH_SECRET` with Node.js:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Paste the printed value after `AUTH_SECRET=` in `.env`. The `.env` file is ignored by Git. Supabase’s [Postgres connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres), [API key guide](https://supabase.com/docs/guides/getting-started/api-keys), and [Storage bucket guide](https://supabase.com/docs/guides/storage/buckets/fundamentals) explain these settings.

## Create the database tables and categories

```bash
npm run db:push
npm run db:seed:categories
```

`db:push` applies the Drizzle schema to the database in `DATABASE_URL`. `db:seed:categories` inserts the default categories and can be run again safely.

Avoid `npm run db:seed` on any database with data. That demo seed deletes existing users, reports, matches, and categories before adding sample records.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production commands

```bash
npm run build
npm start
```

For a hosted deployment, configure the same environment variables in the hosting provider before building. Keep `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, and `AUTH_SECRET` server-side.
