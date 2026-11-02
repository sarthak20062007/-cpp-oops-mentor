import {
  BookOpen,
  Braces,
  ChevronRight,
  Plus,
  Settings,
  SquareTerminal,
} from "lucide-react";
import { Button, IconButton } from "@/components/ui/Controls";
import type { ChatConversation } from "@/types/chat";

interface SidebarProps {
  mode: "default" | "expanded" | "collapsed";
  drawerOpen: boolean;
  conversations: ChatConversation[];
  activeConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onOpenDocumentation: () => void;
  onOpenSettings: () => void;
  onClose: () => void;
}

export default function Sidebar({
  mode,
  drawerOpen,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onOpenDocumentation,
  onOpenSettings,
  onClose,
}: SidebarProps) {
  return (
    <>
      {drawerOpen && (
        <button
          aria-label="Close navigation menu"
          className="drawer-scrim"
          onClick={onClose}
          type="button"
        />
      )}
      <aside
        aria-label="Main navigation"
        className="workspace-sidebar"
        data-drawer-open={drawerOpen}
        data-mode={mode}
      >
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">
            <Braces size={16} strokeWidth={2} />
          </div>
          <div className="sidebar-text brand-copy">
            <span className="brand-name">C++ (OOPs) Mentor</span>
            <span className="brand-compiler">Clang 18.1 · C++23</span>
          </div>
          <IconButton
            className="sidebar-close"
            label="Close navigation"
            onClick={onClose}
          >
            <ChevronRight size={16} />
          </IconButton>
        </div>

        <div className="sidebar-new">
          <Button
            aria-label="New Chat"
            className="new-chat-button"
            onClick={onNewChat}
            variant="subtle"
          >
            <Plus size={15} />
            <span className="sidebar-text">New Chat</span>
          </Button>
        </div>

        <div className="sidebar-sessions">
          <p className="sidebar-section-label sidebar-text">RECENT SESSIONS</p>
          <nav className="session-list" aria-label="Recent sessions">
            {conversations
              .filter((conversation) => conversation.messages.length > 0)
              .map((conversation) => (
                <button
                    aria-label={conversation.title}
                    aria-current={
                    conversation.id === activeConversationId ? "page" : undefined
                  }
                  className={`session-item${conversation.id === activeConversationId ? " session-item--active" : ""}`}
                  key={conversation.id}
                  onClick={() => {
                    onSelectConversation(conversation.id);
                    onClose();
                  }}
                  type="button"
                >
                  <SquareTerminal size={14} aria-hidden="true" />
                  <span className="sidebar-text">{conversation.title}</span>
                </button>
              ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <nav className="sidebar-links" aria-label="Workspace settings">
            <button
              aria-label="Documentation"
              className="sidebar-link"
              onClick={onOpenDocumentation}
              type="button"
            >
              <BookOpen size={15} aria-hidden="true" />
              <span className="sidebar-text">Documentation</span>
            </button>
            <button
              aria-label="Settings"
              className="sidebar-link"
              onClick={onOpenSettings}
              type="button"
            >
              <Settings size={15} aria-hidden="true" />
              <span className="sidebar-text">Settings</span>
            </button>
          </nav>
          <div className="compiler-profile">
            <span className="compiler-dot" aria-hidden="true" />
            <div className="sidebar-text">
              <span className="profile-name">C++ environment</span>
              <span className="profile-version">Clang 18.1 · Ready</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
