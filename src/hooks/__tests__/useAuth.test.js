import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  it('checks the session on mount and transitions to "authed"', async () => {
    const user = { email: 'dev@example.com' };
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => user });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.authStatus).toBe('authed'));
    expect(result.current.user).toEqual(user);
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/me', {
      credentials: 'include',
    });
  });

  it('prints the "Logged in as" banner exactly once when writers are provided', async () => {
    const user = { email: 'dev@example.com' };
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => user });
    const appendLines = jest.fn();
    const makeLine = jest.fn((kind, content) => ({ kind, content }));

    const { result } = renderHook(() => useAuth({ appendLines, makeLine }));

    await waitFor(() => expect(result.current.authStatus).toBe('authed'));
    expect(makeLine).toHaveBeenCalledWith('ok', 'Logged in as dev@example.com');
    expect(appendLines).toHaveBeenCalledTimes(1);
  });

  it('transitions to "anon" when the session response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.authStatus).toBe('anon'));
    expect(result.current.user).toBeNull();
  });

  it('transitions to "anon" when the session request rejects', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.authStatus).toBe('anon'));
    expect(result.current.user).toBeNull();
  });

  it('does not throw when no banner writers are provided', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ email: 'x@y.z' }) });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.authStatus).toBe('authed'));
    expect(result.current.user).toEqual({ email: 'x@y.z' });
  });

  it('logout posts to the logout endpoint and resets to "anon"', async () => {
    const user = { email: 'dev@example.com' };
    global.fetch = jest.fn((url) => {
      if (url === '/api/auth/me') {
        return Promise.resolve({ ok: true, json: async () => user });
      }
      if (url === '/api/auth/logout') {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error(`unexpected url: ${url}`));
    });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.authStatus).toBe('authed'));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.authStatus).toBe('anon');
    expect(result.current.user).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  });

  it('still resets to "anon" if the logout request itself fails', async () => {
    const user = { email: 'dev@example.com' };
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn((url) => {
      if (url === '/api/auth/me') {
        return Promise.resolve({ ok: true, json: async () => user });
      }
      return Promise.reject(new Error('logout failed'));
    });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.authStatus).toBe('authed'));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.authStatus).toBe('anon');
    expect(result.current.user).toBeNull();
  });
});
