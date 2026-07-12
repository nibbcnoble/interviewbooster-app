import { useEffect, useRef, useState } from 'react';
import { makeLine } from '../lib/id';

// Owns the scrollback buffer and keeps it pinned to the bottom as lines
// arrive. Every module gets `appendLines`/`makeLine` from here so the core
// shell and all modules write into the same log.
export function useTerminalLog(initialLines = []) {
  const [log, setLog] = useState(() => initialLines);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  const appendLines = (lines) => {
    setLog((prev) => [...prev, ...lines]);
  };

  const clear = () => setLog([]);

  return { log, appendLines, makeLine, clear, scrollRef };
}
