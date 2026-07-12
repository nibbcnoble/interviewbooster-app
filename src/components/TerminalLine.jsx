import { COLORS } from '../theme/colors';

// Renders one entry from the scrollback log. `line.kind` is the contract
// every module writes against — add a new `case` here when a module wants
// its own visual treatment (e.g. a future module's own result card).
export default function TerminalLine({ line }) {
  switch (line.kind) {
    case 'help':
      return (
        <div style={{ color: COLORS.textDim, whiteSpace: 'pre-wrap' }}>
          {line.content || '\u00A0'}
        </div>
      );
    case 'input':
      return (
        <div style={{ color: COLORS.text }}>
          <span style={{ color: COLORS.amber }}>$</span> {line.content}
        </div>
      );
    case 'question':
      return (
        <div style={{ color: COLORS.amber, margin: '0.3rem 0', whiteSpace: 'pre-wrap' }}>
          Q{line.content.index}/{line.content.total}: {line.content.text}
        </div>
      );
    case 'answer-input':
      return (
        <div style={{ color: COLORS.text }}>
          <span style={{ color: COLORS.amber }}>
            [{line.content.index}/{line.content.total}]$
          </span>{' '}
          {line.content.text}
        </div>
      );
    case 'summary-q':
      return (
        <div style={{ color: COLORS.amber, whiteSpace: 'pre-wrap' }}>
          Q: {line.content}
        </div>
      );
    case 'summary-a':
      return (
        <div style={{ color: COLORS.text, whiteSpace: 'pre-wrap' }}>
          A: {line.content}
        </div>
      );
    case 'ok':
      return <div style={{ color: COLORS.text }}>{line.content}</div>;
    case 'error':
      return <div style={{ color: COLORS.error }}>{line.content}</div>;
    case 'output':
      return (
        <div style={{ color: COLORS.textDim, fontStyle: 'italic' }}>{line.content}</div>
      );
    case 'rule':
      return (
        <div style={{ color: COLORS.textMuted, whiteSpace: 'pre' }}>
          {line.content || '\u00A0'}
        </div>
      );
    case 'result-grade':
      return (
        <div style={{ margin: '0.2rem 0' }}>
          <span style={{ color: line.content.style.color, fontWeight: 700, fontSize: '1.05em' }}>
            [{line.content.style.label}]
          </span>{' '}
          <span style={{ color: line.content.style.color, fontWeight: 700 }}>
            grade: {line.content.grade}/5 ({line.content.style.letter})
          </span>
        </div>
      );
    case 'overall-grade':
      return (
        <div style={{ margin: '0.5rem 0' }}>
          <span style={{ color: line.content.style.color, fontWeight: 700, fontSize: '1.1em' }}>
            overall: {line.content.avg !== null ? line.content.avg.toFixed(1) : 'N/A'}/5 (
            {line.content.style.letter})
          </span>{' '}
          <span style={{ color: COLORS.textMuted }}>
            — {line.content.graded}/{line.content.count} questions graded
          </span>
        </div>
      );
    case 'result-just':
      return (
        <div style={{ color: COLORS.text, whiteSpace: 'pre-wrap', margin: '0.2rem 0 0.6rem 0' }}>
          {line.content}
        </div>
      );
    case 'result-correct':
      return (
        <div style={{ color: COLORS.powderBlue, whiteSpace: 'pre-wrap', margin: '0.2rem 0 0.6rem 0' }}>
          correct answer: {line.content}
        </div>
      );
    case 'result-raw':
      return (
        <div style={{ color: COLORS.textMuted, whiteSpace: 'pre-wrap', fontSize: '0.85em' }}>
          raw: {line.content}
        </div>
      );
    default:
      return null;
  }
}
