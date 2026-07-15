import { useEffect, useRef, useState } from 'react';

// Session-gate state: 'loading' while checking the session, then 'authed'
// or 'anon'. appendLines/makeLine are optional so this hook can be used
// both from the terminal app shell and from standalone pages/components.
// If provided, the hook prints the "Logged in as ..." banner exactly once
// when authStatus flips to 'authed'.
export function useAuth({ appendLines, makeLine } = {}) {
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
    const canWriteBanner =
      typeof appendLines === 'function' && typeof makeLine === 'function';

    if (authStatus === 'authed' && user && !bannerPrinted.current) {
      bannerPrinted.current = true;

      if (canWriteBanner) {
        appendLines([makeLine('ok', `Logged in as ${user.email}`)]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, user, appendLines, makeLine]);

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
