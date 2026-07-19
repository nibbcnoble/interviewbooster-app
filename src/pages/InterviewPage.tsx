import type { KeyboardEvent, RefObject } from 'react';
import Terminal from '../components/Terminal';
import type { Line } from '../lib/id';

export interface InterviewPageProps {
  log: Line[];
  scrollRef: RefObject<HTMLDivElement | null>;
  input: string;
  setInput: (value: string) => void;
  busy: boolean;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  focusInput: () => void;
  badge?: string | null;
  promptLabel?: string;
  placeholder?: string;
}

// Purely presentational. All the state (log, input, busy, module dispatch,
// etc.) still lives in App.jsx because useAuth/useTerminalLog/the modules
// are wired together there. This just renders the terminal for the
// "Interview" tab.
export default function InterviewPage({
  log,
  scrollRef,
  input,
  setInput,
  busy,
  onKeyDown,
  inputRef,
  focusInput,
  badge,
  promptLabel,
  placeholder,
}: InterviewPageProps) {
  return (
    <Terminal
      log={log}
      scrollRef={scrollRef}
      input={input}
      setInput={setInput}
      busy={busy}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      focusInput={focusInput}
      {...(badge !== undefined ? { badge } : {})}
      {...(promptLabel !== undefined ? { promptLabel } : {})}
      {...(placeholder !== undefined ? { placeholder } : {})}
    />
  );
}
