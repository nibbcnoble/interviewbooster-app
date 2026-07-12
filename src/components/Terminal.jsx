import { COLORS, TERMINAL_FONT_STACK } from '../theme/colors';
import TerminalLine from './TerminalLine';

// The live shell: title bar (with an optional module status badge), the
// scrollback, and the input row. This component doesn't know anything
// about "interview" specifically — badge/promptLabel/placeholder all come
// in as props from whichever module is currently active, so a second
// module can drop in without touching this file.
export default function Terminal({
  log,
  scrollRef,
  input,
  setInput,
  busy,
  onKeyDown,
  inputRef,
  focusInput,
  badge = null,
  promptLabel = '$',
  placeholder = 'type a command… (try "help")',
  titleText = 'interview-booster — bash —',
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: COLORS.bg,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 3vw, 2rem)',
        boxSizing: 'border-box',
        fontFamily: TERMINAL_FONT_STACK,
      }}
      onClick={focusInput}
    >
      <style>{`
        @keyframes term-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .term-scroll::-webkit-scrollbar { width: 8px; }
        .term-scroll::-webkit-scrollbar-track { background: transparent; }
        .term-scroll::-webkit-scrollbar-thumb { background: ${COLORS.panelBorder}; border-radius: 4px; }
        input.term-input { caret-color: ${COLORS.cursor}; }
        input.term-input::selection { background: ${COLORS.textDim}; color: ${COLORS.bg}; }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          background: COLORS.panel,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          height: 'min(88vh, 1200px)',
        }}
      >
        {/* title bar */}
        <div
          style={{
            background: COLORS.titlebar,
            borderBottom: `1px solid ${COLORS.panelBorder}`,
            padding: '0.6rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLORS.dot, display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLORS.dot, display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLORS.dot, display: 'inline-block' }} />
          <span style={{ marginLeft: '0.5rem', color: COLORS.textMuted, fontSize: '0.8rem', letterSpacing: '0.02em' }}>
            {titleText}
          </span>
          {badge && (
            <span style={{ marginLeft: 'auto', color: COLORS.amber, fontSize: '0.75rem' }}>{badge}</span>
          )}
        </div>

        {/* scrollback */}
        <div
          ref={scrollRef}
          className="term-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.9rem 1rem',
            fontSize: 'clamp(0.8rem, 3.4vw, 0.92rem)',
            lineHeight: 1.55,
          }}
        >
          {log.map((line) => (
            <TerminalLine key={line.id} line={line} />
          ))}
        </div>

        {/* input line */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.panelBorder}`,
            padding: '0.7rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
            background: COLORS.panel,
          }}
        >
          <span style={{ color: COLORS.amber, fontSize: 'clamp(0.8rem, 3.4vw, 0.92rem)' }}>
            {promptLabel}
          </span>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              ref={inputRef}
              className="term-input"
              type="text"
              value={input}
              disabled={busy}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder={busy ? 'working…' : placeholder}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: COLORS.text,
                fontFamily: 'inherit',
                fontSize: '16px', // prevents iOS auto-zoom on focus
                padding: 0,
              }}
            />
          </div>
          <span
            aria-hidden
            style={{
              width: '8px',
              height: '1.1em',
              background: COLORS.cursor,
              animation: 'term-blink 1s step-start infinite',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
