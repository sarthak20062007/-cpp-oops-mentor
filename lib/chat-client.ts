import type { ChatMessage } from "@/types/chat";

interface StreamCallbacks {
  onToken: (content: string) => void;
}

interface ChatEvent {
  event: "token" | "done" | "error";
  data: { content?: string; error?: string };
}

function parseEvent(block: string): ChatEvent | null {
  let event = "";
  let data = "";

  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    if (line.startsWith("data:")) data += line.slice(5).trim();
  }

  if (!event || !data) return null;
  if (event !== "token" && event !== "done" && event !== "error") return null;

  const parsed: unknown = JSON.parse(data);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("The AI service returned an invalid streaming response.");
  }

  return {
    event,
    data: parsed as ChatEvent["data"],
  };
}

export async function streamChatReply(
  messages: ChatMessage[],
  signal: AbortSignal,
  { onToken }: StreamCallbacks,
): Promise<void> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
    signal,
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = `The AI request failed (HTTP ${response.status}).`;
    try {
      const errorBody: unknown = JSON.parse(responseText);
      if (
        errorBody &&
        typeof errorBody === "object" &&
        "error" in errorBody &&
        typeof errorBody.error === "string"
      ) {
        message = errorBody.error;
      }
    } catch {
      if (responseText.trim()) {
        console.error("The chat API returned a non-JSON error response.");
      }
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("The AI service returned an empty response stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;
  let receivedContent = false;

  function consumeBlock(block: string) {
    const event = parseEvent(block);
    if (!event) return;

    if (event.event === "token" && typeof event.data.content === "string") {
      receivedContent = true;
      onToken(event.data.content);
    } else if (event.event === "done") {
      completed = true;
    } else if (event.event === "error") {
      throw new Error(
        event.data.error ?? "The AI service stopped while generating a reply.",
      );
    }
  }

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });

    let delimiter = buffer.match(/\r?\n\r?\n/);
    while (delimiter?.index !== undefined) {
      const block = buffer.slice(0, delimiter.index);
      buffer = buffer.slice(delimiter.index + delimiter[0].length);
      consumeBlock(block);
      delimiter = buffer.match(/\r?\n\r?\n/);
    }

    if (done) break;
  }

  if (buffer.trim()) consumeBlock(buffer);
  if (!completed) {
    throw new Error("The AI response stream ended unexpectedly.");
  }
  if (!receivedContent) {
    throw new Error("The AI service returned an empty response.");
  }
}
