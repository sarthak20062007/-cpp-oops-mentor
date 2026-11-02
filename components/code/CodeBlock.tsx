"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  isStreaming?: boolean;
  language: string;
}

export default function CodeBlock({
  code,
  isStreaming = false,
  language,
}: CodeBlockProps) {
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (isStreaming) {
      setHighlightedHtml("");
      return;
    }

    let active = true;

    async function highlight() {
      try {
        const { codeToHtml } = await import("shiki");
        const html = await codeToHtml(code, {
          lang: language === "c++" ? "cpp" : language,
          theme: "github-dark-dimmed",
        });
        if (active) setHighlightedHtml(html);
      } catch (error) {
        console.error("Unable to highlight the C++ code sample.", error);
      }
    }

    void highlight();
    return () => {
      active = false;
    };
  }, [code, isStreaming, language]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch (error) {
      console.error("Unable to copy the code sample.", error);
      setCopyState("error");
    }
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <div className="code-file">
          <span className="code-language-dot" />
          <span>move-semantics.cpp</span>
        </div>
        <div className="code-tools">
          <span className="code-language-label">C++</span>
          <button
            aria-label={copyState === "copied" ? "Code copied" : "Copy code"}
            className="copy-code-button"
            onClick={copyCode}
            type="button"
          >
            {copyState === "copied" ? <Check size={13} /> : <Copy size={13} />}
            <span>{copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy code"}</span>
          </button>
        </div>
      </div>
      <div className="code-scroll">
        {highlightedHtml ? (
          <div
            className="shiki-code"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="plain-code">
            <code>{code}</code>
          </pre>
        )}
      </div>
      <span aria-live="polite" className="sr-only">
        {copyState === "copied" ? "Code copied to clipboard." : copyState === "error" ? "Could not copy the code." : ""}
      </span>
    </div>
  );
}
