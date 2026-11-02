"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/chat/ChatMessage";
import MessageInput from "@/components/chat/MessageInput";
import SuggestionChips from "@/components/chat/SuggestionChips";
import WelcomeSection from "@/components/chat/WelcomeSection";
import Sidebar from "@/components/workspace/Sidebar";
import StatusFooter from "@/components/workspace/StatusFooter";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceToolbar from "@/components/workspace/WorkspaceToolbar";
import {
  ACTIVE_CHAT_STORAGE_KEY,
  CHAT_STORAGE_KEY,
  createChatId,
  getConversationTitle,
  initialConversation,
  isChatConversation,
  suggestions,
} from "@/lib/chat";
import {
  ClearChatDialog,
  DocumentationPanel,
  SettingsPanel,
} from "@/components/workspace/WorkspaceDialogs";
import type {
  ChatConversation,
  ChatMessage as ChatMessageData,
} from "@/types/chat";

const EMPTY_MESSAGES: ChatMessageData[] = [];

interface WorkspaceProps {
  initialMessages: ChatMessageData[];
}

export default function Workspace({ initialMessages }: WorkspaceProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([
    { ...initialConversation, messages: initialMessages },
  ]);
  const [activeConversationId, setActiveConversationId] =
    useState(initialConversation.id);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [clearConfirmationOpen, setClearConfirmationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [documentationOpen, setDocumentationOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<
    "default" | "expanded" | "collapsed"
  >("default");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );
  const messages = activeConversation?.messages ?? EMPTY_MESSAGES;

  useEffect(() => {
    try {
      const savedConversations = window.localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedConversations) {
        const parsed: unknown = JSON.parse(savedConversations);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every(isChatConversation)
        ) {
          const restored = parsed as ChatConversation[];
          const savedActiveId = window.localStorage.getItem(
            ACTIVE_CHAT_STORAGE_KEY,
          );
          const restoredActiveId = restored.some(
            (conversation) => conversation.id === savedActiveId,
          )
            ? savedActiveId!
            : restored[0]?.id;
          setConversations(restored);
          if (restoredActiveId) setActiveConversationId(restoredActiveId);
        } else {
          console.warn("Saved C++ (OOPs) Mentor chat history has an invalid format.");
        }
      }
    } catch (error) {
      console.error("Unable to load saved C++ (OOPs) Mentor chat history.", error);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(conversations));
      window.localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, activeConversationId);
    } catch (error) {
      console.error("Unable to save C++ (OOPs) Mentor chat history.", error);
    }
  }, [activeConversationId, conversations, storageReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [loading, messages]);

  const cancelPendingResponse = useCallback(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setLoading(false);
  }, []);

  const createNewChat = useCallback(() => {
    cancelPendingResponse();
    const newConversation: ChatConversation = {
      id: createChatId(),
      title: "New chat",
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((current) => [newConversation, ...current]);
    setActiveConversationId(newConversation.id);
    setDraft("");
    setChatError(null);
    setLoading(false);
    setDrawerOpen(false);
    setShortcutsOpen(false);
    setClearConfirmationOpen(false);
  }, [cancelPendingResponse]);

  const requestClearChat = useCallback(() => {
    setClearConfirmationOpen(true);
    setShortcutsOpen(false);
  }, []);

  const confirmClearChat = useCallback(() => {
    cancelPendingResponse();
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              title: "New chat",
              messages: [],
              updatedAt: Date.now(),
            }
          : conversation,
      ),
    );
    setDraft("");
    setChatError(null);
    setClearConfirmationOpen(false);
  }, [activeConversationId, cancelPendingResponse]);

  const selectConversation = useCallback(
    (id: string) => {
      cancelPendingResponse();
      setActiveConversationId(id);
      setDraft("");
      setChatError(null);
      setDrawerOpen(false);
      setShortcutsOpen(false);
    },
    [cancelPendingResponse],
  );

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      setDrawerOpen((open) => !open);
      return;
    }
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setSidebarMode((mode) => (mode === "expanded" ? "collapsed" : "expanded"));
      return;
    }
    setSidebarMode((mode) => (mode === "collapsed" ? "default" : "collapsed"));
  }, []);

  const sendMessage = useCallback(async () => {
    const content = draft.trim();
    if (!content || loading || !activeConversationId) return;

    const conversationId = activeConversationId;
    const userMessage: ChatMessageData = {
      id: createChatId(),
      role: "user",
      content,
    };
    const requestMessages = [
      ...(conversations.find((conversation) => conversation.id === conversationId)
        ?.messages ?? []),
      userMessage,
    ];
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        const messages = [...conversation.messages, userMessage];
        return {
          ...conversation,
          title: getConversationTitle(messages),
          messages,
          updatedAt: Date.now(),
        };
      }),
    );
    setDraft("");
    setChatError(null);
    setLoading(true);
    const controller = new AbortController();
    activeRequest.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
        signal: controller.signal,
      });
      const responseText = await response.text();
      let result: unknown;
      try {
        result = JSON.parse(responseText);
      } catch {
        if (!response.ok) {
          throw new Error(
            `The chat service failed with HTTP ${response.status}. Please try again.`,
          );
        }
        throw new Error(
          "The chat service returned malformed JSON. Please retry your message.",
        );
      }

      if (!result || typeof result !== "object") {
        throw new Error(
          "The chat service returned an unexpected response. Please retry your message.",
        );
      }

      if (!response.ok) {
        const errorMessage =
          "error" in result && typeof result.error === "string"
            ? result.error
            : "The chat request failed. Please try again.";
        throw new Error(errorMessage);
      }

      if (!("message" in result) || typeof result.message !== "string") {
        throw new Error(
          "The chat service did not return assistant text. Please retry your message.",
        );
      }

      if (controller.signal.aborted) return;
      const assistantContent = result.message.trim();
      if (!assistantContent) {
        throw new Error(
          "The chat service returned an empty answer. Please try again.",
        );
      }
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    id: createChatId(),
                    role: "assistant",
                    content: assistantContent,
                  },
                ],
                updatedAt: Date.now(),
              }
            : conversation,
        ),
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        setChatError(
          error instanceof TypeError
            ? "Unable to connect to the chat service. Check your connection and try again."
            : error instanceof Error
              ? error.message
              : "The response could not be generated. Please try again.",
        );
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }, [activeConversationId, conversations, draft, loading]);

  useEffect(
    () => () => {
      activeRequest.current?.abort();
    },
    [],
  );

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setShortcutsOpen(false);
        setClearConfirmationOpen(false);
        setSettingsOpen(false);
        setDocumentationOpen(false);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function chooseSuggestion(prompt: string) {
    setDraft(prompt);
    inputRef.current?.focus();
  }

  return (
    <div className="workspace-page">
      <div className="workspace-shell">
        <Sidebar
          drawerOpen={drawerOpen}
          mode={sidebarMode}
          conversations={[...conversations].sort(
            (first, second) => second.updatedAt - first.updatedAt,
          )}
          activeConversationId={activeConversationId}
          onClose={() => setDrawerOpen(false)}
          onNewChat={createNewChat}
          onOpenDocumentation={() => {
            setDocumentationOpen(true);
            setDrawerOpen(false);
          }}
          onOpenSettings={() => {
            setSettingsOpen(true);
            setDrawerOpen(false);
          }}
          onSelectConversation={selectConversation}
        />
        <div className="workspace-main">
          <WorkspaceHeader
            onToggleSidebar={toggleSidebar}
            sidebarMode={sidebarMode}
          />
          <WorkspaceToolbar
            onClear={requestClearChat}
            onToggleShortcuts={() => setShortcutsOpen((open) => !open)}
            shortcutsOpen={shortcutsOpen}
          />
          <div className="workspace-content" id="workspace-content">
            <main className="main-content">
              <WelcomeSection />
              <SuggestionChips
                onSelect={chooseSuggestion}
                suggestions={suggestions}
              />
              {messages.length > 0 && (
                <section
                  aria-label="Conversation"
                  className="conversation-section"
                >
                  <div className="conversation-divider">
                    <span />
                    <span className="conversation-divider-label">
                      SESSION DISCUSSION
                    </span>
                    <span />
                  </div>
                  <div className="message-list" aria-live="polite">
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                      />
                    ))}
                    {chatError && (
                      <p className="chat-error" role="alert">
                        {chatError}
                      </p>
                    )}
                    {loading && (
                      <div className="loading-indicator" role="status">
                        <span className="assistant-avatar" aria-hidden="true">
                          <span className="loading-dot" />
                        </span>
                        <span>C++ (OOPs) Mentor is thinking</span>
                        <span className="loading-ellipsis" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </section>
              )}
            </main>
          </div>
          <div className="workspace-bottom">
            <MessageInput
              inputRef={inputRef}
              loading={loading}
              onChange={setDraft}
              onSubmit={sendMessage}
              value={draft}
            />
            <StatusFooter />
          </div>
        </div>
        <ClearChatDialog
          onCancel={() => setClearConfirmationOpen(false)}
          onConfirm={confirmClearChat}
          open={clearConfirmationOpen}
        />
        <SettingsPanel
          onClose={() => setSettingsOpen(false)}
          open={settingsOpen}
        />
        <DocumentationPanel
          onClose={() => setDocumentationOpen(false)}
          open={documentationOpen}
        />
      </div>
    </div>
  );
}
