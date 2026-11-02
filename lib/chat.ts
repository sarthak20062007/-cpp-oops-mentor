import type { ChatConversation, ChatMessage, Suggestion } from "@/types/chat";

export const CHAT_STORAGE_KEY = "cpp-mentor.conversations.v1";
export const ACTIVE_CHAT_STORAGE_KEY = "cpp-mentor.active-conversation.v1";

export function createChatId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export const suggestions: Suggestion[] = [
  {
    category: "MECHANISM",
    label: "constexpr vs consteval",
    prompt: "What is the difference between constexpr and consteval in C++?",
  },
  {
    category: "OWNERSHIP",
    label: "std::move semantics",
    prompt: "Explain std::move and move semantics with an example.",
  },
  {
    category: "COROUTINES",
    label: "Coroutines & co_await",
    prompt: "How do C++ coroutines and co_await work?",
  },
  {
    category: "LIFETIME",
    label: "Zero-overhead RAII",
    prompt: "Explain RAII and how it provides zero-overhead resource management.",
  },
];

export const initialMessages: ChatMessage[] = [
  {
    id: "initial-user",
    role: "user",
    content:
      "Can you explain how std::move works under the hood and show an example of moving a vector?",
  },
  {
    id: "initial-assistant",
    role: "assistant",
    content: `At its core, \`std::move\` does not move anything at runtime. It is an unconditional cast to an rvalue reference (\`static_cast<T&&>\`), which lets overload resolution select a move constructor or move assignment operator. For standard containers such as \`std::vector\`, that usually transfers ownership of the allocated buffer instead of copying each element.

The implementation is intentionally small:

\`\`\`cpp
#include <iostream>
#include <type_traits>
#include <utility>
#include <vector>

template <typename T>
constexpr std::remove_reference_t<T>&& mentor_move(T&& value) noexcept {
    return static_cast<std::remove_reference_t<T>&&>(value);
}

int main() {
    std::vector<int> source{10, 20, 30, 40, 50};
    const auto* original_data = source.data();

    std::vector<int> destination = std::move(source);

    std::cout << std::boolalpha
              << "buffer transferred: "
              << (destination.data() == original_data) << '\\n';
    std::cout << "destination size: " << destination.size() << '\\n';
}
\`\`\`

In practice, use \`std::move\` to make an object eligible for moving; the type still decides what its move operation does. After a successful move, the source object remains valid, but its exact state is unspecified.

### Key takeaways

- **No work happens in the cast:** \`std::move\` is a compile-time cast that changes the value category of an expression.
- **The type controls the transfer:** a move constructor or move assignment operator performs the actual resource transfer.
- **Moved-from objects stay valid:** you can destroy or assign to the source, but do not assume its previous contents remain.
- **Const objects usually copy:** moving from a const object cannot bind to the typical non-const rvalue-reference overload.
`,
  },
];

export const initialConversation: ChatConversation = {
  id: "welcome-session",
  title:
    initialMessages.find((message) => message.role === "user")?.content ??
    "C++ (OOPs) Mentor session",
  messages: initialMessages,
  updatedAt: 1,
};

export function isChatConversation(value: unknown): value is ChatConversation {
  if (!value || typeof value !== "object") return false;
  const conversation = value as Partial<ChatConversation>;
  return (
    typeof conversation.id === "string" &&
    typeof conversation.title === "string" &&
    typeof conversation.updatedAt === "number" &&
    Array.isArray(conversation.messages) &&
    conversation.messages.every(
      (message) =>
        message !== null &&
        typeof message === "object" &&
        typeof message.id === "string" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
  );
}

export function getConversationTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage) return "New chat";
  return firstUserMessage.content.length > 44
    ? `${firstUserMessage.content.slice(0, 44).trimEnd()}…`
    : firstUserMessage.content;
}

export function createMockResponse(prompt: string): string {
  if (/constexpr|consteval/i.test(prompt)) {
    return `\`constexpr\` allows an expression or function to be evaluated at compile time when its inputs are constant expressions, but it can also run at runtime. \`consteval\` (C++20) makes a function immediate: every call must be evaluated at compile time.

Use \`constexpr\` when either compile-time or runtime use is useful; choose \`consteval\` when compile-time evaluation is part of the API contract.

| Keyword | Compile-time call required? | Runtime call allowed? |
| --- | --- | --- |
| \`constexpr\` | No | Yes |
| \`consteval\` | Yes | No |
`;
  }

  if (/coroutine|co_await/i.test(prompt)) {
    return `A coroutine is a function that can suspend and later resume. In C++, \`co_await\` suspends the current coroutine until its awaitable says it is ready, then resumes it through the awaiter's protocol.

The compiler transforms the function into a state machine. A promise type defines how the coroutine starts, suspends, returns, and reports errors. The syntax is built into the language, while scheduling and task ownership come from libraries.
`;
  }

  if (/raii|resource|smart pointer/i.test(prompt)) {
    return `RAII (Resource Acquisition Is Initialization) ties a resource's lifetime to an object's lifetime. The constructor acquires the resource, and the destructor releases it, including when a scope exits because of an exception.

Standard types such as \`std::unique_ptr\`, \`std::lock_guard\`, and \`std::vector\` use this model. Their cleanup is deterministic and does not require a separate manual release path.
`;
  }

  return `\`std::move\` is a cast, not an operation that moves data by itself. It converts its argument to an rvalue expression so the selected type can use a move constructor or move assignment operator.

For a \`std::vector\`, moving commonly transfers its allocation in constant time. The source remains valid after the move, but its contents are unspecified.`;
}
