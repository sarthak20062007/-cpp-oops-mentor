import { Check, Circle } from "lucide-react";

export default function StatusFooter() {
  return (
    <footer className="status-footer" aria-label="Workspace status">
      <span className="status-ready">
        <Check size={12} aria-hidden="true" />
        Clang 18.1.0 Ready
      </span>
      <span className="status-item">
        <Circle size={7} aria-hidden="true" />
        C++23 Standard
      </span>
      <span className="status-item status-encoding">UTF-8</span>
      <span className="status-item status-line-ending">LF</span>
    </footer>
  );
}
