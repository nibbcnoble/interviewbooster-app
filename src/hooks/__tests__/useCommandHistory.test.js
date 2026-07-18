import { renderHook, act } from '@testing-library/react';
import { useCommandHistory } from '../useCommandHistory';

describe('useCommandHistory', () => {
  it('does nothing on recallUp when history is empty', () => {
    const { result } = renderHook(() => useCommandHistory());
    const setInput = jest.fn();
    act(() => result.current.recallUp(setInput));
    expect(setInput).not.toHaveBeenCalled();
  });

  it('does nothing on recallDown before any recallUp (index is null)', () => {
    const { result } = renderHook(() => useCommandHistory());
    const setInput = jest.fn();
    act(() => result.current.push('a'));
    act(() => result.current.recallDown(setInput));
    expect(setInput).not.toHaveBeenCalled();
  });

  it('walks backwards through history with recallUp and clamps at the oldest', () => {
    const { result } = renderHook(() => useCommandHistory());
    const setInput = jest.fn();

    act(() => result.current.push('a'));
    act(() => result.current.push('b'));
    act(() => result.current.push('c'));

    act(() => result.current.recallUp(setInput)); // newest
    expect(setInput).toHaveBeenLastCalledWith('c');
    act(() => result.current.recallUp(setInput));
    expect(setInput).toHaveBeenLastCalledWith('b');
    act(() => result.current.recallUp(setInput));
    expect(setInput).toHaveBeenLastCalledWith('a');
    act(() => result.current.recallUp(setInput)); // clamped at oldest
    expect(setInput).toHaveBeenLastCalledWith('a');
  });

  it('walks forward with recallDown and clears the input past the newest entry', () => {
    const { result } = renderHook(() => useCommandHistory());
    const setInput = jest.fn();

    act(() => result.current.push('a'));
    act(() => result.current.push('b'));
    act(() => result.current.push('c'));

    // move to the oldest, then walk forward
    act(() => result.current.recallUp(setInput)); // 'c'
    act(() => result.current.recallUp(setInput)); // 'b'
    act(() => result.current.recallUp(setInput)); // 'a'

    act(() => result.current.recallDown(setInput));
    expect(setInput).toHaveBeenLastCalledWith('b');
    act(() => result.current.recallDown(setInput));
    expect(setInput).toHaveBeenLastCalledWith('c');
    act(() => result.current.recallDown(setInput)); // past newest -> clear
    expect(setInput).toHaveBeenLastCalledWith('');
  });

  it('resets the cursor after a new push so recallUp starts from the newest again', () => {
    const { result } = renderHook(() => useCommandHistory());
    const setInput = jest.fn();

    act(() => result.current.push('a'));
    act(() => result.current.push('b'));
    act(() => result.current.recallUp(setInput)); // 'b'
    act(() => result.current.recallUp(setInput)); // 'a'

    act(() => result.current.push('c')); // resets index to null
    act(() => result.current.recallUp(setInput));
    expect(setInput).toHaveBeenLastCalledWith('c');
  });
});
