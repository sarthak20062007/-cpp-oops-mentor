import { ArrowUpRight } from "lucide-react";
import type { Suggestion } from "@/types/chat";

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSelect: (prompt: string) => void;
}

export default function SuggestionChips({
  suggestions,
  onSelect,
}: SuggestionChipsProps) {
  return (
    <section aria-label="Suggested questions" className="suggestion-grid">
      {suggestions.map((suggestion) => (
        <button
          className="suggestion-card"
          key={suggestion.label}
          onClick={() => onSelect(suggestion.prompt)}
          type="button"
        >
          <span className="suggestion-category">{suggestion.category}</span>
          <span className="suggestion-label">{suggestion.label}</span>
          <ArrowUpRight className="suggestion-arrow" size={14} aria-hidden="true" />
        </button>
      ))}
    </section>
  );
}
