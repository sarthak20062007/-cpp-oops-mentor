# C++ (OOPs) Mentor

Learn Complete C++. Master OOPs.

A C++ learning assistant focused on object-oriented programming, with support
for C++ concepts, programming, debugging, code explanations, exam preparation,
and viva practice.

## Requirements

- Node.js 20 or newer
- npm
- An OpenRouter API key

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set your OpenRouter API key:

   ```dotenv
   OPENROUTER_API_KEY=your-api-key
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   OPENROUTER_MODEL=nvidia/nemotron-3.5-super-vl:free
   ```

   Keep `.env.local` private; it is excluded from Git.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run typecheck
npm run lint
npm run build
npm run knowledge:check
npm run test:chat-retrieval
```

## Deploy to Vercel

1. Import this project’s Git repository in Vercel and keep the project root set
   to the repository root.
2. Use the detected Next.js framework settings and the default install/build
   commands (`npm install` and `npm run build`).
3. Add these server-side environment variables in Vercel’s Project Settings.
   Set them for each environment where chat should work:

   - `OPENROUTER_API_KEY` — your OpenRouter key (mark as sensitive).
   - `OPENROUTER_BASE_URL` — `https://openrouter.ai/api/v1` (optional; this is
     the default).
   - `OPENROUTER_MODEL` — `nvidia/nemotron-3.5-super-vl:free` (optional; this
     is the default).

   Do not prefix these variables with `NEXT_PUBLIC_`; the API key must remain
   server-only. Redeploy after changing environment variables.
4. Deploy and test both the homepage and a chat request on the Vercel URL.

The `/api/chat` function includes the runtime knowledge-base files through
Next.js output file tracing, so syllabus retrieval and its supporting unit,
exam, and program material are available in the serverless deployment.

Chat requests are sent server-side to OpenRouter. The API key is never sent to
the browser. The chat endpoint allows at most 20 requests per minute per
client IP in each server process. This in-memory limit is best-effort; configure
your hosting proxy to overwrite `X-Real-IP` or `X-Forwarded-For` with a
trusted client address for it to be effective.

## College syllabus knowledge base

The official 2025 Zeal College of Engineering & Research, Pune syllabus is
stored in [`knowledge-base/syllabus/college-oops-syllabus.json`](./knowledge-base/syllabus/college-oops-syllabus.json).
The server retrieves matching unit/topic context before sending a chat request
to OpenRouter. Unit guides and the note-authoring template are documented in
[`knowledge-base/README.md`](./knowledge-base/README.md); detailed college-
reviewed teaching notes can be added there without changing the frontend.

## Git secret check

The pre-commit hook rejects staged environment files and scans staged content
for common API-key and credential patterns. Enable it once per clone:

```bash
git config core.hooksPath .githooks
```

Run the staged-file check manually with `npm run security:staged`.