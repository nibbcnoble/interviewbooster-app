import { COLORS } from '../theme/colors';
import TerminalFrame from './TerminalFrame';
import { MicrosoftMark, GoogleMark } from './icons/OAuthIcons';

export default function LoginScreen() {
  return (
    <TerminalFrame statusLabel="401">
      <div style={{ color: COLORS.textDim, fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1.1rem' }}>
        <div>$ whoami</div>
        <div style={{ color: COLORS.error }}>authentication required</div>
      </div>

      <div style={{ color: COLORS.text, fontSize: '0.9rem', marginBottom: '1rem' }}>
        Sign in to continue<br/>
        
        <span style={{color: COLORS.amber, fontSize: '0.75rem' }}>Note: Your email adress is never stored directly.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <a className="oauth-btn" href="/api/auth/login/microsoft">
          <MicrosoftMark />
          <span>Sign in with Microsoft</span>
          <span className="cmd-text prompt">↵</span>
        </a>
        <a className="oauth-btn" href="/api/auth/login/google">
          <GoogleMark />
          <span>Sign in with Google</span>
          <span className="cmd-text prompt">↵</span>
        </a>
      </div>

      <div
        style={{
          marginTop: '1.4rem',
          paddingTop: '0.9rem',
          borderTop: `1px solid ${COLORS.panelBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: COLORS.textMuted,
          fontSize: '0.8rem',
        }}
      >
        <span style={{ color: COLORS.amber }}>$</span>
        <span>waiting for authentication</span>
        <span
          aria-hidden
          style={{
            width: '7px',
            height: '1em',
            background: COLORS.cursor,
            animation: 'term-blink 1s step-start infinite',
            display: 'inline-block',
          }}
        />
      </div>
    </TerminalFrame>
  );
}
