import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface TabBarProps {
  onLogout: () => void;
  userEmail?: string | undefined;
  isAuthed: boolean;
}

interface Tab {
  label: string;
  to: string;
  matchPaths: string[];
}

// Site nav is intentionally minimal for now: just About and the Technical
// Blog. Docs/Interview/Study/Stocks stay registered as routes (see App.tsx)
// but are unlinked from here until they're ready to be featured again.
const TABS: Tab[] = [
  { label: 'About', to: '/about', matchPaths: ['/', '/about'] },
  { label: 'Technical Blog', to: '/scenarios', matchPaths: ['/scenarios'] },
];

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 17c1-3.5 4-5 6.5-5s5.5 1.5 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function TabBar({ onLogout, userEmail, isAuthed }: TabBarProps) {
  const { pathname } = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // close the account menu on outside click
  useEffect(() => {
    if (!accountOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [accountOpen]);

  // close the mobile nav menu on outside click
  useEffect(() => {
    if (!navOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [navOpen]);

  const handleLogoutClick = () => {
    setAccountOpen(false);
    onLogout();
  };

  const isTabActive = (tab: Tab) => tab.matchPaths.includes(pathname);

  return (
    <nav className="site-nav" aria-label="Main">
      <div className="site-nav-inner">
        <Link to="/" className="site-brand" aria-label="Jeff Noble, home">
          <span className="site-brand-mark" aria-hidden="true">JN</span>
          <span className="site-brand-text">
            <span className="site-brand-name">Jeff Noble</span>
            <span className="site-brand-role">Software Engineer</span>
          </span>
        </Link>

        {/* desktop-only: full link row, hidden on mobile in favor of the hamburger below */}
        <div className="site-nav-links">
          {TABS.map((tab) => {
            const isActive = isTabActive(tab);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={isActive ? 'site-nav-link site-nav-link-active' : 'site-nav-link'}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="site-nav-actions" ref={accountRef}>
          {isAuthed ? (
            <>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-label="Account menu"
              >
                <AccountIcon />
              </button>
              {accountOpen && (
                <div className="dropdown-menu dropdown-menu-right">
                  <div className="dropdown-menu-label">Signed in as {userEmail}</div>
                  <button type="button" className="dropdown-item" onClick={handleLogoutClick}>
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/interview" className="site-nav-login">
              Log in
            </Link>
          )}
        </div>

        {/* mobile-only: hamburger replaces the link row below a breakpoint */}
        <div className="site-nav-toggle" ref={navRef}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setNavOpen((v) => !v)}
            aria-expanded={navOpen}
            aria-label="Open navigation menu"
          >
            <HamburgerIcon />
          </button>
          {navOpen && (
            <div className="dropdown-menu dropdown-menu-right">
              {TABS.map((tab) => (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={isTabActive(tab) ? 'dropdown-item dropdown-item-active' : 'dropdown-item'}
                  onClick={() => setNavOpen(false)}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
