import { useState } from 'react';
import type { ModuleContract } from '../moduleContract';
import type { Line } from '../../lib/id';

const HELP_LINES: string[] = [
  'interview john                  start an interview with John',
  'interview paul                  start an interview with Paul',
  'interview george                start an interview with George',
  'interview ringo                 start an interview with Ringo',
  'goodbye                         end the current Beatle interview',
];

type BeatleName = 'john' | 'paul' | 'george' | 'ringo';

const PERSONAS: Record<BeatleName, { greeting: string }> = {
  john: {
    greeting:
      "John here. Ask what you like. I'll give you the straight of it, crooked though it may be.",
  },
  paul: {
    greeting: "Paul here. Right then, let’s get on with it — ask away.",
  },
  george: {
    greeting: "George here. Go on then. Ask what you want, and we’ll see what’s worth saying.",
  },
  ringo: {
    greeting: "Ringo here, my friend. Lovely to chat — fire away.",
  },
};

async function askBeatle(beatle: BeatleName, question: string): Promise<{ answer?: string }> {
  const response = await fetch('/api/beatles/interview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ beatle, question }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'request failed');
  }

  return data;
}

export interface UseBeatlesModuleOptions {
  appendLines: (lines: Line[]) => void;
  makeLine: (kind: string, content: unknown) => Line;
  busy: boolean;
  setBusy: (busy: boolean) => void;
}

export function useBeatlesModule({
  appendLines,
  makeLine,
  busy,
  setBusy,
}: UseBeatlesModuleOptions): ModuleContract {
  const [activeBeatle, setActiveBeatle] = useState<BeatleName | null>(null);

  const startInterview = (beatle: string) => {
    if (busy) return;

    if (!PERSONAS[beatle as BeatleName]) {
      appendLines([
        makeLine('error', 'error: invalid beatle. use john, paul, george, or ringo.'),
      ]);
      return;
    }

    if (activeBeatle) {
      appendLines([
        makeLine('error', `error: already interviewing ${activeBeatle}. say "goodbye" first.`),
      ]);
      return;
    }

    const typedBeatle = beatle as BeatleName;
    setActiveBeatle(typedBeatle);

    appendLines([
      makeLine('rule', '┌─ beatles interview ' + '─'.repeat(15)),
      makeLine('help', PERSONAS[typedBeatle].greeting),
      makeLine('help', `you are now interviewing ${typedBeatle}. type a question and press enter.`),
      makeLine('help', 'say "goodbye" at any time to end the interview.'),
      makeLine('rule', '└' + '─'.repeat(38)),
    ]);
  };

  const stopInterview = () => {
    if (!activeBeatle) return;

    appendLines([makeLine('ok', `[ok] ended interview with ${activeBeatle}`)]);

    setActiveBeatle(null);
  };

  const submitQuestion = async (text: string) => {
    if (!activeBeatle) return;

    appendLines([makeLine('input', text), makeLine('output', `asking ${activeBeatle}...`)]);

    setBusy(true);

    try {
      const result = await askBeatle(activeBeatle, text);

      appendLines([makeLine('ok', `${activeBeatle}: ${result.answer || '(no answer returned)'}`)]);
    } catch (err) {
      appendLines([makeLine('error', `error: ${(err as Error).message}`)]);
    } finally {
      setBusy(false);
    }
  };

  const handleCommand = (cmd: string): boolean => {
    const match = cmd.match(/^interview\s+(john|paul|george|ringo)\s*$/i);
    if (match) {
      startInterview((match[1] as string).toLowerCase());
      return true;
    }

    if (/^goodbye\s*$/i.test(cmd) && activeBeatle) {
      stopInterview();
      return true;
    }

    return false;
  };

  const handleCapturedInput = (trimmed: string) => {
    if (/^goodbye\s*$/i.test(trimmed)) {
      appendLines([makeLine('input', trimmed)]);
      stopInterview();
      return;
    }

    submitQuestion(trimmed);
  };

  return {
    id: 'beatles',
    helpLines: HELP_LINES,
    capturing: activeBeatle !== null,
    statusBadge: activeBeatle ? `interviewing ${activeBeatle}` : null,
    promptLabel: activeBeatle ? `[${activeBeatle}]$` : '$',
    placeholder: activeBeatle ? `ask ${activeBeatle} a question…` : 'interview john',
    handleCommand,
    handleCapturedInput,
  };
}
