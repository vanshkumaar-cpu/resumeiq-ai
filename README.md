# ResumeIQ AI

A premium AI resume analyzer: ATS scoring, keyword matching, AI-rewritten
resume sections, and tailored interview prep — built with Next.js 16
(App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion,
Prisma + Postgres, and the Gemini API.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:

   ```bash
   DATABASE_URL="postgresql://..."   # Postgres connection string
   SESSION_SECRET="..."              # already generated for local dev
   GEMINI_API_KEY="your-key-from-ai-studio"
   ```

   Get a Gemini key from [Google AI Studio](https://aistudio.google.com/apikey).
   Without it, sign-up/login/dashboard/history all work, but resume
   analysis requests will fail with a clear error.

3. Apply migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You'll be redirected
   to `/login` — create an account to get into the dashboard.

## Deploying on Railway

This repo ships a `railway.json` (build/start/pre-deploy commands) and a
`postinstall` script (`prisma generate`) so Railway's default Nixpacks
builder works out of the box:

1. Create a Railway project, add a **Postgres** database to it, and add a
   service connected to this repo's GitHub remote.
2. On the app service, set env vars: `SESSION_SECRET` and `GEMINI_API_KEY`.
   `DATABASE_URL` is provided automatically if you reference the Postgres
   plugin's variable (`${{Postgres.DATABASE_URL}}`).
3. Push to the connected branch — Railway builds, runs
   `prisma migrate deploy` as a pre-deploy step, then starts the app.

## Stack notes

- **Auth**: custom email/password auth — bcrypt password hashing, JWT
  session cookies signed with `jose`, route protection via `src/proxy.ts`
  (this Next.js version renamed `middleware.ts` to `proxy.ts`).
- **Database**: Prisma 7 with the new `prisma-client` generator (output at
  `src/generated/prisma`) and the `@prisma/adapter-pg` driver adapter,
  which Prisma 7 requires at runtime.
- **AI**: `@google/genai` calling `gemini-flash-latest` with structured JSON
  output (`responseJsonSchema`) so responses are validated JSON, not
  parsed prose. See `src/lib/ai/`. Free-tier keys currently have 0 quota
  for `gemini-2.5-pro` — the flash alias is what works without billing.
- **Resume parsing**: `pdf-parse` v2 (`PDFParse` class) for PDFs, `mammoth`
  for DOCX, plain text for `.txt`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (runs TypeScript checks)
- `npm run lint` — ESLint
- `npx prisma studio` — browse the database
- `npx prisma migrate dev` — create/apply a migration locally
- `npx prisma migrate deploy` — apply migrations (used in production)
