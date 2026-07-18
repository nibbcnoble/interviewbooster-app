import { renderHook, act } from '@testing-library/react';
import { useTerminalLog } from '../useTerminalLog';

describe('useTerminalLog', () => {
  it('starts with an empty log by default', () => {
    const { result } = renderHook(() => useTerminalLog());
    expect(result.current.log).toEqual([]);
  });

  it('seeds the log from the provided initial lines', () => {
    const initial = [{ id: 'l0', kind: 'ok', content: 'hi' }];
    const { result } = renderHook(() => useTerminalLog(initial));
    expect(result.current.log).toEqual(initial);
  });

  it('appends lines, preserving order across multiple calls', () => {
    const { result } = renderHook(() => useTerminalLog());

    act(() => {
      result.current.appendLines([
        result.current.makeLine('ok', 'a'),
        result.current.makeLine('output', 'b'),
      ]);
    });
    act(() => {
      result.current.appendLines([result.current.makeLine('error', 'c')]);
    });

    expect(result.current.log).toHaveLength(3);
    expect(result.current.log.map((l) => l.content)).toEqual(['a', 'b', 'c']);
    expect(result.current.log[0]).toMatchObject({ kind: 'ok', content: 'a' });
  });

  it('clears the log', () => {
    const { result } = renderHook(() => useTerminalLog());
    act(() => result.current.appendLines([result.current.makeLine('ok', 'x')]));
    expect(result.current.log).toHaveLength(1);

    act(() => result.current.clear());
    expect(result.current.log).toEqual([]);
  });

  it('exposes makeLine and a scroll ref (null until attached)', () => {
    const { result } = renderHook(() => useTerminalLog());
    expect(typeof result.current.makeLine).toBe('function');
    expect(result.current.scrollRef).toHaveProperty('current');
    expect(result.current.scrollRef.current).toBeNull();
  });
});
