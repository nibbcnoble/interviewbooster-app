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

// Add new tabs here. `matchPaths` lets a tab claim more than one route
// (e.g. Interview claims both "/" and "/interview").
const TABS: Tab[] = [
  { label: 'Docs', to: '/docs', matchPaths: ['/', '/docs'] },
  { label: 'Interview', to: '/interview', matchPaths: ['/interview'] },
  { label: 'Study', to: '/study', matchPaths: ['/study'] },
  { label: 'Stocks', to: '/stocks', matchPaths: ['/stocks'] },
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
    <nav className="tab-bar">
      {/* mobile-only: hamburger replaces the tab row below a breakpoint */}
      <div className="tab-bar-nav-toggle" ref={navRef}>
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
          <div className="dropdown-menu dropdown-menu-left">
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

      {/* desktop-only: full tab row, hidden on mobile in favor of the hamburger above */}
      <div className="tab-bar-tabs">
        {TABS.map((tab) => {
          const isActive = isTabActive(tab);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={isActive ? 'tab tab-active' : 'tab'}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {isAuthed && (
        <div className="tab-bar-actions" ref={accountRef}>
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
              <div className="dropdown-menu-label">Signed in as: {userEmail}</div>
              <button type="button" className="dropdown-item" onClick={handleLogoutClick}>
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
