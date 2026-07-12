import { useState } from 'react';

// Up/down arrow recall through previously entered commands.
export function useCommandHistory() {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);

  const push = (cmd) => {
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);
  };

  const recallUp = (setInput) => {
    if (history.length === 0) return;
    const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(nextIndex);
    setInput(history[nextIndex]);
  };

  const recallDown = (setInput) => {
    if (historyIndex === null) return;
    const nextIndex = historyIndex + 1;
    if (nextIndex >= history.length) {
      setHistoryIndex(null);
      setInput('');
    } else {
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    }
  };

  return { push, recallUp, recallDown };
}
