import { X } from "lucide-react";
import { Button, IconButton } from "@/components/ui/Controls";

interface ClearChatDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ClearChatDialog({
  open,
  onCancel,
  onConfirm,
}: ClearChatDialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-scrim" onMouseDown={onCancel}>
      <section
        aria-labelledby="clear-chat-title"
        aria-modal="true"
        className="workspace-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="dialog-heading">
          <div>
            <p className="dialog-eyebrow">CURRENT SESSION</p>
            <h2 id="clear-chat-title">Clear this chat?</h2>
          </div>
          <IconButton label="Close confirmation" onClick={onCancel}>
            <X size={16} />
          </IconButton>
        </div>
        <p className="dialog-description">
          This will clear the current conversation. Other saved chats will
          remain in your recent sessions.
        </p>
        <div className="dialog-actions">
          <Button onClick={onCancel} variant="quiet">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="subtle">
            Clear Chat
          </Button>
        </div>
      </section>
    </div>
  );
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  if (!open) return null;

  return (
    <div className="dialog-scrim" onMouseDown={onClose}>
      <section
        aria-labelledby="settings-title"
        aria-modal="true"
        className="workspace-dialog settings-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="dialog-heading">
          <div>
            <p className="dialog-eyebrow">WORKSPACE</p>
            <h2 id="settings-title">Settings</h2>
          </div>
          <IconButton label="Close settings" onClick={onClose}>
            <X size={16} />
          </IconButton>
        </div>
        <div className="settings-list">
          <div className="settings-row">
            <div>
              <span className="settings-label">Compiler</span>
              <span className="settings-description">
                Active C++ compiler environment
              </span>
            </div>
            <span className="settings-value">Clang 18.1.0</span>
          </div>
          <div className="settings-row">
            <div>
              <span className="settings-label">Language standard</span>
              <span className="settings-description">
                Standard used for examples
              </span>
            </div>
            <span className="settings-value">C++23</span>
          </div>
          <div className="settings-row">
            <div>
              <span className="settings-label">Chat history</span>
              <span className="settings-description">
                Conversations are stored on this device
              </span>
            </div>
            <span className="settings-value">Local</span>
          </div>
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose} variant="subtle">
            Done
          </Button>
        </div>
      </section>
    </div>
  );
}

export function DocumentationPanel({ open, onClose }: SettingsPanelProps) {
  if (!open) return null;

  return (
    <div className="dialog-scrim" onMouseDown={onClose}>
      <section
        aria-labelledby="documentation-title"
        aria-modal="true"
        className="workspace-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="dialog-heading">
          <div>
            <p className="dialog-eyebrow">C++ REFERENCE</p>
            <h2 id="documentation-title">Documentation</h2>
          </div>
          <IconButton label="Close documentation" onClick={onClose}>
            <X size={16} />
          </IconButton>
        </div>
        <div className="settings-list">
          <a
            className="documentation-link"
            href="https://en.cppreference.com/w/"
            rel="noreferrer"
            target="_blank"
          >
            <span>cppreference</span>
            <span>Language and standard library reference</span>
          </a>
          <a
            className="documentation-link"
            href="https://isocpp.org/"
            rel="noreferrer"
            target="_blank"
          >
            <span>Standard C++</span>
            <span>News, resources, and language community</span>
          </a>
        </div>
        <div className="dialog-actions">
          <Button onClick={onClose} variant="subtle">
            Done
          </Button>
        </div>
      </section>
    </div>
  );
}
