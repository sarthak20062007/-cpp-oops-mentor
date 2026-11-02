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
```

Chat requests are sent server-side to OpenRouter. The API key is never sent to
the browser.