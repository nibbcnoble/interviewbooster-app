import { useEffect, useRef, useState } from 'react';
import { makeLine, Line } from '../lib/id';

export interface UseTerminalLogResult {
  log: Line[];
  appendLines: (lines: Line[]) => void;
  makeLine: typeof makeLine;
  clear: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

// Owns the scrollback buffer and keeps it pinned to the bottom as lines
// arrive. Every module gets `appendLines`/`makeLine` from here so the core
// shell and all modules write into the same log.
export function useTerminalLog(initialLines: Line[] = []): UseTerminalLogResult {
  const [log, setLog] = useState<Line[]>(() => initialLines);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  const appendLines = (lines: Line[]) => {
    setLog((prev) => [...prev, ...lines]);
  };

  const clear = () => setLog([]);

  return { log, appendLines, makeLine, clear, scrollRef };
}
