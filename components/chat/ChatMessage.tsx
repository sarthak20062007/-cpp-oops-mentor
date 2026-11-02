import { Braces, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/code/CodeBlock";
import type { ChatMessage as ChatMessageData } from "@/types/chat";

export default function ChatMessage({
  message,
  isStreaming = false,
}: {
  message: ChatMessageData;
  isStreaming?: boolean;
}) {
  if (message.role === "user") {
    return (
      <article className="message message--user">
        <div className="message-meta message-meta--right">
          <span>You</span>
          <span className="meta-separator">·</span>
          <span>Just now</span>
          <UserRound size={12} aria-hidden="true" />
        </div>
        <div className="user-bubble">{message.content}</div>
      </article>
    );
  }

  return (
    <article className="message message--assistant">
      <div className="assistant-heading">
        <span className="assistant-avatar" aria-hidden="true">
          <Braces size={14} />
        </span>
        <span className="assistant-name">C++ (OOPs) Mentor</span>
        <span className="meta-separator">·</span>
        <span className="assistant-context">Standard Library</span>
      </div>
      <div className="assistant-content markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const language = /language-(\w+)/.exec(className ?? "")?.[1];
              const code = String(children).replace(/\n$/, "");
              if (language) {
                return (
                  <CodeBlock
                    code={code}
                    isStreaming={isStreaming}
                    language={language}
                  />
                );
              }
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return <>{children}</>;
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      <div className="message-actions">
        <span>Generated for C++23</span>
        <span className="message-action-divider" />
        <span>Compiler checked</span>
      </div>
    </article>
  );
}
