import { ArrowUp } from "lucide-react";
import {
  useEffect,
  type MouseEvent,
  type RefObject,
  type TouchEvent,
} from "react";

interface MessageInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

export default function MessageInput({
  value,
  loading,
  onChange,
  onSubmit,
  inputRef,
}: MessageInputProps) {
  function resizeTextarea(element: HTMLTextAreaElement) {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 144)}px`;
  }

  useEffect(() => {
    if (inputRef.current) resizeTextarea(inputRef.current);
  }, [inputRef, value]);

  function focusInputFromContainer(
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
  ) {
    const target = event.target;
    if (target instanceof Element && target.closest("button")) return;
    inputRef.current?.focus();
  }

  return (
    <form
      className="message-composer"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div
        aria-label="Message input area"
        className="composer-box"
        onClick={focusInputFromContainer}
        onTouchStart={focusInputFromContainer}
        role="group"
      >
        <textarea
          aria-label="Ask anything about C++"
          className="composer-textarea"
          onChange={(event) => {
            onChange(event.target.value);
            resizeTextarea(event.target);
          }}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Ask anything about C++…"
          ref={inputRef}
          rows={1}
          value={value}
        />
        <div className="composer-controls">
          <button
            aria-label="Send message"
            className="send-button"
            disabled={loading || !value.trim()}
            type="submit"
          >
            <span className="send-label">{loading ? "Thinking…" : "Send"}</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
      <div className="composer-hint-row">
        <span>C++ (OOPs) Mentor references ISO/IEC standards (C++11 through C++23).</span>
        <span>Press <kbd>Return</kbd> to ask</span>
      </div>
    </form>
  );
}
