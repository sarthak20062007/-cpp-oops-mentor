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
  createMockResponse,
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
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    if (responseTimer.current) {
      clearTimeout(responseTimer.current);
      responseTimer.current = null;
    }
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
    setClearConfirmationOpen(false);
  }, [activeConversationId, cancelPendingResponse]);

  const selectConversation = useCallback(
    (id: string) => {
      cancelPendingResponse();
      setActiveConversationId(id);
      setDraft("");
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

  const sendMessage = useCallback(() => {
    const content = draft.trim();
    if (!content || loading || !activeConversationId) return;

    const conversationId = activeConversationId;
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        const messages = [
          ...conversation.messages,
          { id: createChatId(), role: "user" as const, content },
        ];
        return {
          ...conversation,
          title: getConversationTitle(messages),
          messages,
          updatedAt: Date.now(),
        };
      }),
    );
    setDraft("");
    setLoading(true);
    if (responseTimer.current) clearTimeout(responseTimer.current);
    responseTimer.current = setTimeout(() => {
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
                    content: createMockResponse(content),
                  },
                ],
                updatedAt: Date.now(),
              }
            : conversation,
        ),
      );
      setLoading(false);
      responseTimer.current = null;
    }, 700);
  }, [activeConversationId, draft, loading]);

  useEffect(
    () => () => {
      if (responseTimer.current) clearTimeout(responseTimer.current);
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
