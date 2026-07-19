import { useState } from 'react';

export interface UseCommandHistoryResult {
  push: (cmd: string) => void;
  recallUp: (setInput: (value: string) => void) => void;
  recallDown: (setInput: (value: string) => void) => void;
}

// Up/down arrow recall through previously entered commands.
export function useCommandHistory(): UseCommandHistoryResult {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const push = (cmd: string) => {
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);
  };

  const recallUp = (setInput: (value: string) => void) => {
    if (history.length === 0) return;
    const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(nextIndex);
    setInput(history[nextIndex] ?? '');
  };

  const recallDown = (setInput: (value: string) => void) => {
    if (historyIndex === null) return;
    const nextIndex = historyIndex + 1;
    if (nextIndex >= history.length) {
      setHistoryIndex(null);
      setInput('');
    } else {
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? '');
    }
  };

  return { push, recallUp, recallDown };
}
