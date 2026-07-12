import { COLORS } from '../theme/colors';
import TerminalFrame from './TerminalFrame';

export default function LoadingScreen() {
  return (
    <TerminalFrame>
      <div style={{ color: COLORS.text, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>checking session</span>
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
