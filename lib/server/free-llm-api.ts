import "server-only";

import OpenAI from "openai";
import type { MessageRole } from "@/types/chat";

interface ApiChatMessage {
  role: MessageRole;
  content: string;
}

const SYSTEM_INSTRUCTIONS = `You are C++ (OOPs) Mentor, an expert C++ programming tutor. Your primary specialization is deeply teaching object-oriented programming, but you also support all C++ concepts, programming, debugging, and code explanations. Never refuse or unnecessarily redirect a general C++ question.

You can provide complete C++ programs, line-by-line explanations, debugging and corrections, expected output, algorithms and complexity analysis, advanced OOPs lessons with practical examples, university exam answers tailored to 2, 4, 6, or 10 marks, viva questions, and practice problems.

For programming questions, explain the problem and relevant concepts, include an algorithm when useful, provide complete working C++ code, state the expected output, and explain important code sections. Adapt theoretical answers to the depth requested. Use Markdown and fenced cpp code blocks for code.`;

const MAX_HISTORY_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 16_000;
const MAX_HISTORY_LENGTH = 80_000;

let client: OpenAI | undefined;

function getClient(): OpenAI {
  const apiKey = process.env.FREELLMAPI_API_KEY?.trim();
  const baseURL = process.env.FREELLMAPI_BASE_URL?.trim();

  if (!apiKey) {
    throw new Error("FREELLMAPI_API_KEY is not configured on the server.");
  }
  if (!baseURL) {
    throw new Error("FREELLMAPI_BASE_URL is not configured on the server.");
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL,
      maxRetries: 1,
      timeout: 90_000,
    });
  }

  return client;
}

export function getModel(): string {
  const model = process.env.FREELLMAPI_MODEL?.trim();
  if (!model) {
    throw new Error("FREELLMAPI_MODEL is not configured on the server.");
  }
  return model;
}

export function validateChatHistory(
  value: unknown,
): { messages: ApiChatMessage[] } | { error: string } {
  if (!Array.isArray(value) || value.length === 0) {
    return { error: "Send at least one chat message." };
  }
  if (value.length > MAX_HISTORY_MESSAGES) {
    return { error: `Conversation history is limited to ${MAX_HISTORY_MESSAGES} messages.` };
  }

  let totalLength = 0;
  const messages: ApiChatMessage[] = [];

  for (const entry of value) {
    if (
      !entry ||
      typeof entry !== "object" ||
      !("role" in entry) ||
      !("content" in entry)
    ) {
      return { error: "Each message must include a role and text content." };
    }

    const { role, content } = entry;
    if (role !== "user" && role !== "assistant") {
      return { error: "Message roles must be user or assistant." };
    }
    if (typeof content !== "string" || !content.trim()) {
      return { error: "Message content must be a non-empty string." };
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { error: "A message exceeds the 16,000 character limit." };
    }

    totalLength += content.length;
    if (totalLength > MAX_HISTORY_LENGTH) {
      return { error: "Conversation history exceeds the 80,000 character limit." };
    }
    messages.push({ role, content });
  }

  if (messages.at(-1)?.role !== "user") {
    return { error: "The latest conversation message must be from the user." };
  }

  return { messages };
}

export async function createChatCompletionStream(
  messages: ApiChatMessage[],
  signal: AbortSignal,
) {
  return getClient().chat.completions.create(
    {
      model: getModel(),
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        ...messages.map(({ role, content }) => ({ role, content })),
      ],
      stream: true,
    },
    { signal },
  );
}

export function getUpstreamError(error: unknown): {
  status: number;
  message: string;
} {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return {
        status: 429,
        message: "The AI service is rate limited. Please wait a moment and retry.",
      };
    }
    if (error.status === 401 || error.status === 403) {
      return {
        status: 502,
        message: "The AI service rejected its configured credentials.",
      };
    }
    if (error.status === 408 || error.status === 504) {
      return {
        status: 504,
        message: "The AI service timed out. Please try again.",
      };
    }
  }

  return {
    status: 502,
    message: "The AI service could not be reached. Please try again shortly.",
  };
}
