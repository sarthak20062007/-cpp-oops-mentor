import { ChevronRight, Command, Eraser } from "lucide-react";
import { Badge, Button } from "@/components/ui/Controls";

interface WorkspaceToolbarProps {
  onClear: () => void;
  shortcutsOpen: boolean;
  onToggleShortcuts: () => void;
}

export default function WorkspaceToolbar({
  onClear,
  shortcutsOpen,
  onToggleShortcuts,
}: WorkspaceToolbarProps) {
  return (
    <div className="workspace-toolbar">
      <div className="toolbar-leading">
        <div className="breadcrumb">
          <span className="breadcrumb-muted">Workspace</span>
          <ChevronRight size={13} aria-hidden="true" />
          <span>General C++</span>
        </div>
        <Badge className="standard-badge">C++23</Badge>
      </div>
      <div className="toolbar-actions">
        <Button
          aria-label="Clear Chat"
          className="toolbar-button"
          onClick={onClear}
          variant="quiet"
        >
          <Eraser size={14} />
          <span>Clear Chat</span>
        </Button>
        <div className="shortcuts-wrap">
          <Button
            aria-label="Keyboard shortcuts"
            aria-expanded={shortcutsOpen}
            className="toolbar-button"
            onClick={onToggleShortcuts}
            variant="quiet"
          >
            <Command size={14} />
            <span>Shortcuts</span>
          </Button>
          {shortcutsOpen && (
            <div className="shortcuts-popover" role="dialog" aria-label="Keyboard shortcuts">
              <p className="shortcuts-title">Keyboard shortcuts</p>
              <div><kbd>Return</kbd><span>Send message</span></div>
              <div><kbd>Shift + Return</kbd><span>New line</span></div>
              <div><kbd>Esc</kbd><span>Close this menu</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
