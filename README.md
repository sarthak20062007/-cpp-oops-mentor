# C++ (OOPs) Mentor

Learn Complete C++. Master OOPs.

A C++ learning assistant focused on object-oriented programming, with support
for C++ concepts, programming, debugging, code explanations, exam preparation,
and viva practice.

## Requirements

- Node.js 20 or newer
- npm
- An OpenAI-compatible FreeLLMAPI endpoint and API key

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:

   ```dotenv
   FREELLMAPI_API_KEY=your-unified-api-key
   FREELLMAPI_BASE_URL=https://your-openai-compatible-endpoint/v1
   FREELLMAPI_MODEL=your-model-name
   ```

   Keep this file private; it is excluded from Git.

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

Chat requests are streamed through the server-side `/api/chat` route. API
credentials are read only by the server.