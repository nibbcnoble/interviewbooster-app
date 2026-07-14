import Terminal from '../components/Terminal';

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
}) {
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
      badge={badge}
      promptLabel={promptLabel}
      placeholder={placeholder}
    />
  );
}
