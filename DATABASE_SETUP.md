# Database Setup (Vercel + Postgres + Prisma)

Your current auth backend writes to JSON files on disk. That works locally, but on Vercel the filesystem is **ephemeral/read-only**, so registration/login breaks.

This repo now supports a real database using **Postgres + Prisma** and Vercel-compatible API routes under `/api`.

## 1) Create a Postgres database

Use any managed Postgres provider:

- **Neon** (recommended): https://neon.tech
- **Supabase** (Postgres only): https://supabase.com
- **Vercel Postgres** (if you want it tied to Vercel)

Copy the connection string and set it as `DATABASE_URL`.

## 2) Configure env vars locally

1. Create `.env.local` in the project root.
2. Add:

```bash
DATABASE_URL="...your postgres url..."
JWT_SECRET="...long random string..."
REFRESH_TOKEN_SECRET="...long random string..."
```

## 3) Create tables (Prisma migration)

Run:

```bash
npm run prisma:migrate
```

## 3b) Load existing data + quiz questions

This will:

- Load **all quiz categories + questions** from `src/data/quizData.ts` into Postgres
- Import existing users from `backend/data/users.json`
- Import existing quiz progress/results from `backend/data/progress.json` into `QuizAttempt`

Run:

```bash
npm run db:seed
```

This will create the tables in your Postgres database.

(Optional) Open Prisma Studio:

```bash
npm run prisma:studio
```

## 4) Local development

You have two options:

### Option A (recommended): Vercel-style local dev

Install Vercel CLI and run:

```bash
npm i -g vercel
vercel dev
```

This runs the Vite app and the `/api/*` serverless routes together.

### Option B: keep your existing Express backend

Your existing Express backend still runs with:

```bash
npm run dev
```

If you use this option, set `VITE_API_BASE_URL` in `.env.local`:

```bash
VITE_API_BASE_URL="http://localhost:3001/api/auth"
```

(But the Vercel deployment uses `/api/*`, not the Express server.)

## 5) Deploy to Vercel

In Vercel Project → **Settings** → **Environment Variables**, add:

- `DATABASE_URL`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`

Then redeploy.

## What’s implemented

- `/api/auth/register`, `/api/auth/login`, `/api/auth/verify`, `/api/auth/refresh-token`, `/api/auth/logout`
- `/api/quiz/results` (POST saves quiz result, GET returns last 50 attempts)

Quiz questions are still in `src/data/quizData.ts` (fast + zero DB reads). If you want, we can add a seed script to load all questions into `QuizCategory`/`QuizQuestion` tables.
