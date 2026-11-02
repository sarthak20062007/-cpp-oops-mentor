import OpenAI, { APIError } from "openai";

export const runtime = "nodejs";

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_MODEL = "nvidia/nemotron-3.5-super-vl:free";
const MAX_BODY_BYTES = 96 * 1024;
const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 16_000;
const MAX_TOTAL_LENGTH = 64_000;

const SYSTEM_INSTRUCTIONS = `You are C++ (OOPs) Mentor, an expert C++ programming tutor. Your tagline is "Learn Complete C++. Master OOPs." You are not a generic chatbot: focus on helping users learn and apply C++ while answering general C++ questions directly. Object-Oriented Programming is your primary specialization, and OOPs questions deserve extra depth and practical examples.

Cover C++ fundamentals, syntax, control flow, functions, recursion, arrays, strings, pointers, references, structures, unions, classes, objects, constructors, destructors, encapsulation, data hiding, abstraction, inheritance (including multiple, multilevel, hybrid, virtual base classes, and the diamond problem), compile-time and runtime polymorphism, overloading, overriding, virtual and pure virtual functions, abstract classes, friend functions/classes, static members, this, templates, STL, exceptions, file handling, dynamic memory, shallow/deep copying, data structures, searching/sorting, complexity, and C++11/14/17/20/23.

Explain difficult topics in beginner-friendly language and adapt the depth to the request. For programming tasks, include the relevant concept, a complete compilable C++ program, expected output, important code explanation, and complexity when relevant. For theory, define terms clearly and use examples, comparisons, or simple text diagrams where useful. Support requested 2/4/6/10-mark answers, viva practice, and exercises. For debugging, identify the actual problem and why it occurs, then provide corrected code when appropriate. For incomplete programming requests, ask a concise clarifying question instead of guessing. Do not invent C++ syntax, APIs, or program output; state assumptions or uncertainty when needed. Do not force irrelevant sections into every answer.`;

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function parseMessages(value: unknown): IncomingMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return null;
  }

  let totalLength = 0;
  const messages: IncomingMessage[] = [];

  for (const item of value) {
    if (
      !item ||
      typeof item !== "object" ||
      !("role" in item) ||
      !("content" in item) ||
      (item.role !== "user" && item.role !== "assistant") ||
      typeof item.content !== "string"
    ) {
      return null;
    }

    const content = item.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) return null;
    totalLength += content.length;
    if (totalLength > MAX_TOTAL_LENGTH) return null;
    messages.push({ role: item.role, content });
  }

  if (messages.at(-1)?.role !== "user") return null;
  return messages;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return jsonError("OpenRouter is not configured. Set OPENROUTER_API_KEY on the server.", 503);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonError("The request is too large.", 413);
  }

  const reader = request.body?.getReader();
  if (!reader) return jsonError("Request body is required.", 400);

  const chunks: Uint8Array[] = [];
  let bodySize = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bodySize += value.byteLength;
    if (bodySize > MAX_BODY_BYTES) {
      await reader.cancel();
      return jsonError("The request is too large.", 413);
    }
    chunks.push(value);
  }
  const bodyBytes = new Uint8Array(bodySize);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const bodyText = new TextDecoder().decode(bodyBytes);

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }

  if (!body || typeof body !== "object" || !("messages" in body)) {
    return jsonError("Request must include a messages array.", 400);
  }

  const messages = parseMessages(body.messages);
  if (!messages) {
    return jsonError(
      `Messages must contain 1-${MAX_MESSAGES} non-empty user or assistant entries, end with a user message, and stay within the request limits.`,
      400,
    );
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL:
        process.env.OPENROUTER_BASE_URL?.trim() || DEFAULT_BASE_URL,
      timeout: 45_000,
      maxRetries: 1,
    });
    const completion = await client.chat.completions.create(
      {
        model: process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTIONS },
          ...messages,
        ],
      },
      { signal: request.signal },
    );
    const response = completion.choices[0]?.message.content;

    if (typeof response !== "string" || !response.trim()) {
      return jsonError("OpenRouter returned an empty response. Please try again.", 502);
    }

    return Response.json({ message: response });
  } catch (error) {
    if (error instanceof Error && error.name === "APIConnectionTimeoutError") {
      return jsonError("OpenRouter took too long to respond. Please try again.", 504);
    }
    if (error instanceof Error && error.name === "APIConnectionError") {
      return jsonError("Unable to reach OpenRouter. Check the server connection and try again.", 502);
    }

    if (error instanceof APIError) {
      if (error.status === 429) {
        return jsonError("OpenRouter is rate-limiting requests. Please try again shortly.", 429);
      }
      if (error.status === 401 || error.status === 403) {
        return jsonError("OpenRouter rejected the server credentials or model access.", 502);
      }
      if (error.status && error.status >= 400 && error.status < 500) {
        return jsonError("OpenRouter could not process this request. Check the configured model and try again.", 502);
      }
      return jsonError("OpenRouter is temporarily unavailable. Please try again.", 502);
    }

    console.error("OpenRouter chat request failed.", error);
    return jsonError("Unable to reach OpenRouter. Check the server connection and try again.", 502);
  }
}
