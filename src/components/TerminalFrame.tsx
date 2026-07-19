import type { ReactNode } from 'react';
import { COLORS, TERMINAL_FONT_STACK } from '../theme/colors';

export interface TerminalFrameProps {
  children: ReactNode;
  statusLabel?: string;
  title?: string;
}

// Shared chrome (centered card, title bar, blinking-cursor keyframes) used
// by the auth screens. The live Terminal component has its own frame
// because it needs a taller flex-column layout for scrollback + input.
export default function TerminalFrame({
  children,
  statusLabel,
  title = 'interview-grader — auth —',
}: TerminalFrameProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: COLORS.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 3vw, 2rem)',
        boxSizing: 'border-box',
        fontFamily: TERMINAL_FONT_STACK,
      }}
    >
      <style>{`
        @keyframes term-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .oauth-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          width: 300px;
          padding: 0.65rem 0.85rem;
          background: ${COLORS.bg};
          border: 1px solid ${COLORS.panelBorder};
          border-radius: 6px;
          color: ${COLORS.text};
          font-family: inherit;
          font-size: 0.85rem;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .oauth-btn:hover, .oauth-btn:focus-visible {
          border-color: ${COLORS.amber};
          background: ${COLORS.titlebar};
          outline: none;
        }
        .oauth-btn .prompt { color: ${COLORS.amber}; }
        .oauth-btn .cmd-text { color: ${COLORS.textMuted}; margin-left: auto; font-size: 0.78rem; }
      `}</style>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: COLORS.panel,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            background: COLORS.titlebar,
            borderBottom: `1px solid ${COLORS.panelBorder}`,
            padding: '0.6rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLORS.dot, display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLORS.dot, display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLORS.dot, display: 'inline-block' }} />
          <span style={{ marginLeft: '0.5rem', color: COLORS.textMuted, fontSize: '0.8rem', letterSpacing: '0.02em' }}>
            {title}
          </span>
          {statusLabel && (
            <span style={{ marginLeft: 'auto', color: COLORS.amber, fontSize: '0.75rem' }}>{statusLabel}</span>
          )}
        </div>
        <div style={{ padding: '1.4rem 1.3rem' }}>{children}</div>
      </div>
    </div>
  );
}
