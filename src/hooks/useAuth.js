import { useEffect, useRef, useState } from 'react';

// Session-gate state: 'loading' while checking the session, then 'authed'
// or 'anon'. Pass appendLines/makeLine in so this hook can print the
// "Logged in as ..." banner exactly once, the first time authStatus flips
// to 'authed' — it fires after the initial help text is already in the
// log, so it shows up as the first "live" line instead of replacing it.
export function useAuth({ appendLines, makeLine }) {
  const [authStatus, setAuthStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const bannerPrinted = useRef(false);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setAuthStatus('authed');
        } else {
          setAuthStatus('anon');
        }
      })
      .catch(() => setAuthStatus('anon'));
  }, []);

  useEffect(() => {
    if (authStatus === 'authed' && user && !bannerPrinted.current) {
      bannerPrinted.current = true;
      appendLines([makeLine('ok', `Logged in as ${user.email}`)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, user]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    // reset regardless of whether the request itself succeeded — if the
    // network call failed, the safest UI state is still "logged out" so
    // the person isn't left staring at a terminal with a dead session
    bannerPrinted.current = false;
    setUser(null);
    setAuthStatus('anon');
  };

  return { authStatus, user, logout };
}
