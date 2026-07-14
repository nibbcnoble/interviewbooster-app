import { useState } from 'react';
import { shuffle, extractQuoted } from '../../lib/textUtils';
import { downloadFile } from '../../lib/downloadFile';
import { QUESTION_POOL, getCorrectAnswer } from './questionPool';
import { gradeOne, gradeStyleFor } from './grading';
import { buildMarkdownReport } from './report';
import { INTERVIEW_HELP_LINES } from './helpText';

// Encapsulates every piece of state and command handling for the "interview"
// module: loading a single Q/A pair and grading it, running a multi-question
// mock interview, and exporting a session's results as markdown.
//
// Returns an object matching the module contract described in
// modules/moduleContract.js — App.jsx doesn't need to know any of the
// interview-specific details below, just how to call handleCommand /
// handleCapturedInput and read the badge/prompt/placeholder.
export function useInterviewModule({ appendLines, makeLine, busy, setBusy }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // interview mode: { questions: string[], idx: number, results: {question, answer, grade, justification}[] }
  const [interview, setInterview] = useState(null);

  // running log of every graded question/answer this session (single execs
  // and interview rounds), used by "interview save" to build the
  // downloadable markdown report
  const [sessionResults, setSessionResults] = useState([]);

  // ---- single question/answer grading ----

  const runExec = async () => {
    if (!question.trim()) {
      appendLines([makeLine('error', 'error: no question loaded. run: interview -q "..."')]);
      return;
    }
    setBusy(true);
    appendLines([makeLine('output', 'grading...')]);
    try {
      const result = await gradeOne(question, answer);
      const style = gradeStyleFor(result.grade);
      const correctAnswer = getCorrectAnswer(question);

      setSessionResults((prev) => [
        ...prev,
        {
          question,
          answer,
          grade: result.grade,
          justification: result.justification,
          correctAnswer,
          timestamp: new Date().toISOString(),
        },
      ]);

      const resultLines = [
        makeLine('rule', '┌─ grading result ' + '─'.repeat(20)),
        makeLine('result-grade', { style, grade: result.grade }),
        makeLine('result-just', result.justification || '(no justification returned)'),
      ];
      if (correctAnswer) {
        resultLines.push(makeLine('result-correct', correctAnswer));
      }
      if (result.raw) {
        resultLines.push(makeLine('result-raw', result.raw));
      }
      resultLines.push(makeLine('rule', '└' + '─'.repeat(38)));

      appendLines(resultLines);
    } catch (err) {
      appendLines([makeLine('error', `error: ${err.message}`)]);
    } finally {
      setBusy(false);
    }
  };

  // ---- interview flow ----

  const printQuestion = (idx, total, text) => {
    appendLines([
      makeLine('rule', ''),
      makeLine('question', { index: idx + 1, total, text }),
    ]);
  };

  const startInterview = (count) => {
    if (interview) {
      appendLines([makeLine('error', 'error: interview already in progress. finish it or run "interview cancel".')]);
      return;
    }
    const requested = Number.isInteger(count) ? count : 10;
    const total = Math.max(1, Math.min(requested, QUESTION_POOL.length));
    if (Number.isInteger(count) && (count < 1 || count > QUESTION_POOL.length)) {
      appendLines([
        makeLine(
          'error',
          `note: requested ${count} questions, using ${total} (valid range is 1-${QUESTION_POOL.length}).`
        ),
      ]);
    }
    const questions = shuffle(QUESTION_POOL).slice(0, total);
    setInterview({ questions, idx: 0, results: [] });
    appendLines([
      makeLine('rule', '┌─ interview started ' + '─'.repeat(17)),
      makeLine('help', `${total} question${total === 1 ? '' : 's'}, answered one at a time.`),
      makeLine('help', 'type your answer and press enter. run "interview cancel" to abort.'),
      makeLine('rule', '└' + '─'.repeat(38)),
    ]);
    printQuestion(0, questions.length, questions[0]);
  };

  const cancelInterview = () => {
    if (!interview) {
      appendLines([makeLine('error', 'error: no interview in progress.')]);
      return;
    }
    setInterview(null);
    appendLines([makeLine('error', 'interview cancelled.')]);
  };

  const finishInterview = (results) => {
    const gradesGiven = results.filter((r) => typeof r.grade === 'number');
    const avg = gradesGiven.length
      ? gradesGiven.reduce((sum, r) => sum + r.grade, 0) / gradesGiven.length
      : null;
    const overallStyle = avg !== null ? gradeStyleFor(Math.round(avg)) : gradeStyleFor(null);

    const lines = [
      makeLine('rule', ''),
      makeLine('rule', '┌─ interview complete ' + '─'.repeat(16)),
    ];

    results.forEach((r, i) => {
      const style = gradeStyleFor(r.grade);
      lines.push(makeLine('rule', `── question ${i + 1}/${results.length} ${'─'.repeat(20)}`));
      lines.push(makeLine('summary-q', r.question));
      lines.push(makeLine('summary-a', r.answer));
      lines.push(
        makeLine('result-grade', {
          style,
          grade: r.grade !== null && r.grade !== undefined ? r.grade : 'N/A',
        })
      );
      lines.push(makeLine('result-just', r.justification || '(no justification returned)'));
      const correctAnswer = r.correctAnswer || getCorrectAnswer(r.question);
      if (correctAnswer) {
        lines.push(makeLine('result-correct', correctAnswer));
      }
    });

    lines.push(makeLine('rule', '─'.repeat(38)));
    lines.push(
      makeLine('overall-grade', {
        style: overallStyle,
        avg,
        count: results.length,
        graded: gradesGiven.length,
      })
    );
    lines.push(makeLine('rule', '└' + '─'.repeat(38)));

    appendLines(lines);
    setInterview(null);
  };

  const submitInterviewAnswer = async (answerText) => {
    const current = interview;
    const currentQuestion = current.questions[current.idx];

    appendLines([
      makeLine('answer-input', { index: current.idx + 1, total: current.questions.length, text: answerText }),
      makeLine('output', 'loading next question...'),
    ]);

    setBusy(true);
    let resultEntry;
    try {
      const result = await gradeOne(currentQuestion, answerText);
      resultEntry = {
        question: currentQuestion,
        answer: answerText,
        grade: result.grade,
        justification: result.justification,
        correctAnswer: getCorrectAnswer(currentQuestion),
      };
    } catch (err) {
      resultEntry = {
        question: currentQuestion,
        answer: answerText,
        grade: null,
        justification: `grading failed: ${err.message}`,
        correctAnswer: getCorrectAnswer(currentQuestion),
      };
    }
    setBusy(false);
    setSessionResults((prev) => [...prev, { ...resultEntry, timestamp: new Date().toISOString() }]);

    const newResults = [...current.results, resultEntry];
    const nextIdx = current.idx + 1;

    if (nextIdx >= current.questions.length) {
      finishInterview(newResults);
    } else {
      setInterview({ ...current, idx: nextIdx, results: newResults });
      appendLines([makeLine('ok', `[ok] answer ${current.idx + 1} recorded`)]);
      printQuestion(nextIdx, current.questions.length, current.questions[nextIdx]);
    }
  };

  // ---- export / save ----

  const saveInterview = () => {
    if (sessionResults.length === 0) {
      appendLines([
        makeLine('error', 'error: nothing to save yet. run "interview exec" or "interview start" first.'),
      ]);
      return;
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `interview-report-${stamp}.md`;
    const markdown = buildMarkdownReport(sessionResults);

    try {
      downloadFile(filename, markdown, 'text/markdown;charset=utf-8');
      appendLines([makeLine('ok', `[ok] saved ${sessionResults.length} graded answer(s) to ${filename}`)]);
    } catch (err) {
      appendLines([makeLine('error', `error: could not save file — ${err.message}`)]);
    }
  };

  // ---- module contract: command dispatch ----

  const handleCommand = (cmd) => {
    if (/^interview\s+start\s*$/.test(cmd)) {
      startInterview();
      return true;
    }
    if (/^interview\s+start\s+--q=\d+\s*$/.test(cmd)) {
      const match = cmd.match(/--q=(\d+)/);
      startInterview(parseInt(match[1], 10));
      return true;
    }
    if (/^interview\s+start\s+/.test(cmd)) {
      appendLines([
        makeLine('error', 'usage: interview start | interview start --q=<number>'),
      ]);
      return true;
    }
    if (/^interview\s+cancel\s*$/.test(cmd)) {
      cancelInterview();
      return true;
    }
    if (/^interview\s+save\s*$/.test(cmd)) {
      saveInterview();
      return true;
    }
   
    if (/^interview\s+exec\s*$/.test(cmd)) {
      runExec();
      return true;
    }
    if (/^interview\s*$/.test(cmd)) {
      appendLines([
        makeLine('error', 'usage: interview exec | interview start [--q=<number>]'),
      ]);
      return true;
    }
    return false;
  };

  // ---- module contract: capture mode (mid-interview free-text answers) ----
  // While an interview is running, every Enter press is a free-text answer
  // *except* the two escape hatches below, which still need to work
  // mid-flow so the user isn't stuck until the interview ends.

  const handleCapturedInput = (trimmed) => {
    if (/^interview\s+cancel\s*$/.test(trimmed)) {
      appendLines([makeLine('input', trimmed)]);
      cancelInterview();
      return;
    }
    if (/^interview\s+save\s*$/.test(trimmed)) {
      appendLines([makeLine('input', trimmed)]);
      saveInterview();
      return;
    }
    submitInterviewAnswer(trimmed);
  };

  return {
    id: 'interview',
    helpLines: INTERVIEW_HELP_LINES,
    capturing: interview !== null,
    statusBadge: interview ? `interview ${interview.idx + 1}/${interview.questions.length}` : null,
    promptLabel: interview ? `[${interview.idx + 1}/${interview.questions.length}]$` : null,
    placeholder: interview ? 'type your answer…' : 'interview -q "..."',
    handleCommand,
    handleCapturedInput,
  };
}
