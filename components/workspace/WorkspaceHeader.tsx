import { Braces, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IconButton } from "@/components/ui/Controls";

interface WorkspaceHeaderProps {
  sidebarMode: "default" | "expanded" | "collapsed";
  onToggleSidebar: () => void;
}

export default function WorkspaceHeader({
  sidebarMode,
  onToggleSidebar,
}: WorkspaceHeaderProps) {
  return (
    <header className="workspace-header">
      <div className="header-leading">
        <IconButton
          className="menu-toggle"
          label="Toggle navigation"
          onClick={onToggleSidebar}
        >
          <Menu className="mobile-menu-icon" size={18} />
          {sidebarMode === "collapsed" ? (
            <PanelLeftOpen className="desktop-menu-icon" size={17} />
          ) : (
            <PanelLeftClose className="desktop-menu-icon" size={17} />
          )}
        </IconButton>
        <span className="workspace-app-icon" aria-hidden="true">
          <Braces size={15} />
        </span>
        <span className="workspace-title">C++ (OOPs) Mentor Workspace</span>
      </div>
      <div className="workspace-header-meta">
        <span className="online-indicator" />
        <span>Terminal</span>
        <span className="header-meta-divider">/</span>
        <span className="mono">target: C++23</span>
      </div>
    </header>
  );
}
