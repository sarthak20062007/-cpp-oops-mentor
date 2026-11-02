import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  createChatCompletionStream,
  getModel,
  getUpstreamError,
  validateChatHistory,
} from "@/lib/server/free-llm-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function toEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function logUpstreamFailure(error: unknown, context: string) {
  if (error instanceof OpenAI.APIError) {
    console.error(`${context}:`, {
      name: error.name,
      status: error.status,
      requestId: error.requestID,
    });
    return;
  }
  console.error(
    `${context}:`,
    error instanceof Error ? error.name : "Unknown error",
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const messages =
    payload && typeof payload === "object" && "messages" in payload
      ? validateChatHistory(payload.messages)
      : { error: "Request must include a messages array." };

  if ("error" in messages) {
    return NextResponse.json({ error: messages.error }, { status: 400 });
  }

  let stream: Awaited<ReturnType<typeof createChatCompletionStream>>;
  try {
    getModel();
    stream = await createChatCompletionStream(messages.messages, request.signal);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("FREELLMAPI_")) {
      console.error("FreeLLMAPI server configuration error:", error.message);
      return NextResponse.json(
        { error: "The AI service is not configured correctly on the server." },
        { status: 503 },
      );
    }

    logUpstreamFailure(error, "FreeLLMAPI request failed");

    const upstreamError = getUpstreamError(error);
    return NextResponse.json(
      { error: upstreamError.message },
      { status: upstreamError.status },
    );
  }

  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (cancelled) return;
          const content = chunk.choices[0]?.delta?.content;
          if (typeof content === "string" && content.length > 0) {
            controller.enqueue(toEvent("token", { content }));
          }
        }
        if (cancelled) return;
        controller.enqueue(toEvent("done", {}));
        controller.close();
      } catch (error) {
        if (cancelled || request.signal.aborted) return;

        logUpstreamFailure(error, "FreeLLMAPI stream failed");
        const upstreamError = getUpstreamError(error);
        controller.enqueue(
          toEvent("error", { error: upstreamError.message }),
        );
        controller.close();
      }
    },
    cancel() {
      cancelled = true;
      stream.controller.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
