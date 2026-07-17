import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import TabBar from './components/TabBar';
import InterviewPage from './pages/InterviewPage';
import StudyPage from './pages/StudyPage';
import DocsPage from './pages/DocsPage';
import { useAuth } from './hooks/useAuth';
import { useTerminalLog } from './hooks/useTerminalLog';
import { useCommandHistory } from './hooks/useCommandHistory';
import { useInterviewModule } from './modules/interview/useInterviewModule';
import { useBeatlesModule } from './modules/beatles/useBeatlesModule';

// Printed once on load, before the session check even resolves.
const BANNER_LINES = [
  'Welcome, this is a shell for my ai projects.  See the docs for how this works.',
  '',
  'available commands:',
];

// Core commands that exist regardless of which modules are active. Module
// commands (e.g. "interview ...") are documented by each module's own
// helpLines and appended below this list when "help" runs.
const CORE_HELP_LINES = [

  'clear                           clear the screen',
  'logout                          sign out and return to the login screen',
  'help                            show this message',
];

const TIP_LINE = 'tip: use ↑ / ↓ to move through command history';

function buildInitialLog(makeLine, modules) {
  const lines = [...BANNER_LINES, ...CORE_HELP_LINES, ...modules.flatMap((m) => m.helpLines), '', TIP_LINE];
  return lines.map((l) => makeLine('help', l));
}

export default function App() {
  const { log, appendLines, makeLine, clear, scrollRef } = useTerminalLog();
  const { authStatus, logout, user } = useAuth({ appendLines, makeLine });
  const { push: pushHistory, recallUp, recallDown } = useCommandHistory();

  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const seededLog = useRef(false);

  const inputRef = useRef(null);

  // ---- active modules ----
  // To add another module: call its hook here and add it to this array.
  // Everything else (help text, command dispatch, capture-mode routing,
  // the title-bar badge) picks it up automatically. See
  // modules/moduleContract.js for the shape each hook must return.
  const interviewModule = useInterviewModule({ appendLines, makeLine, busy, setBusy });
  const beatlesModule = useBeatlesModule({ appendLines, makeLine, busy, setBusy });
  const modules = [interviewModule, beatlesModule];

  // seed the scrollback with banner + help text exactly once
  useEffect(() => {
    if (!seededLog.current) {
      seededLog.current = true;
      appendLines(buildInitialLog(makeLine, modules));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusInput = () => inputRef.current && inputRef.current.focus();

  // the input is disabled while busy (grading), which strips focus from it.
  // once it's re-enabled, put the cursor back so the user can keep typing.
  useEffect(() => {
    if (!busy) {
      focusInput();
    }
  }, [busy]);

  const runHello = async () => {
    setBusy(true);
    appendLines([makeLine('output', 'pinging server...')]);
    try {
      const response = await fetch(`/api/hello`);
      const result = await response.json();
      appendLines([makeLine('ok', `[ok] server responded: ${result.message}`)]);
    } catch (err) {
      appendLines([makeLine('error', `error: could not reach server (${err.message})`)]);
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // ---- command dispatch ----
  // Order: built-in core commands first, then each active module gets a
  // chance to claim the command. First module to return true from
  // handleCommand wins; if none claim it, it's "command not found".
  const handleCommand = (raw) => {
    const cmd = raw.trim();
    if (cmd === '') return;

    appendLines([makeLine('input', cmd)]);
    pushHistory(cmd);

    if (cmd === 'clear') {
      clear();
      return;
    }
    if (cmd === 'help') {
      const allHelp = [...CORE_HELP_LINES, ...modules.flatMap((m) => ['', ...m.helpLines])];
      appendLines(allHelp.map((l) => makeLine('help', l)));
      return;
    }
    if (cmd === 'hello') {
      runHello();
      return;
    }
    if (cmd === 'logout') {
      handleLogout();
      return;
    }

    for (const mod of modules) {
      if (mod.handleCommand(cmd)) return;
    }

    appendLines([makeLine('error', `command not found: ${cmd}`)]);
  };

  const onKeyDown = (e) => {
    if (busy) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      const raw = input;
      setInput('');

      const trimmed = raw.trim();
      if (trimmed === '') return;

      const capturingModule = modules.find((m) => m.capturing);
      if (capturingModule) {
        capturingModule.handleCapturedInput(trimmed);
        return;
      }

      handleCommand(raw);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      recallUp(setInput);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      recallDown(setInput);
    }
  };

  if (authStatus === 'loading') return <LoadingScreen />;
  if (authStatus === 'anon') return <LoginScreen />;

  const capturingModule = modules.find((m) => m.capturing);

  // Interview tab needs the full terminal state/handlers; Study and Docs
  // are self-contained stubs for now and don't need any of this.
  const interviewElement = (
    <InterviewPage
      log={log}
      scrollRef={scrollRef}
      input={input}
      setInput={setInput}
      busy={busy}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      focusInput={focusInput}
      badge={capturingModule?.statusBadge ?? null}
      promptLabel={capturingModule?.promptLabel ?? '$'}
      placeholder={capturingModule?.placeholder ?? 'interview -q "..."'}
    />
  );

  return (
    <>
      <TabBar onLogout={handleLogout} userEmail={user?.email} />
      <Routes>
        {/* hostname/ and hostname/interview both render the Interview tab */}
        <Route path="/" element={<DocsPage />} />
        <Route path="/interview" element={interviewElement} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/docs" element={<DocsPage />} />
        {/* anything unrecognized falls back to the default tab */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
