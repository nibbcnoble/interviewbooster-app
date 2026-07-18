import { buildMarkdownReport } from '../report';
import { QUESTION_POOL, ANSWER_POOL } from '../questionPool';

describe('buildMarkdownReport', () => {
  it('renders a header, a generated timestamp, and the graded count', () => {
    const md = buildMarkdownReport([]);
    expect(md).toContain('# Interview Grading Report');
    expect(md).toMatch(/- \*\*Generated:\*\* .+/);
    expect(md).toContain('- **Questions graded:** 0');
  });

  it('omits the overall average when no numeric grades are present', () => {
    const md = buildMarkdownReport([
      { question: 'Q', answer: 'A', grade: undefined, justification: 'x' },
    ]);
    expect(md).not.toContain('Overall average');
  });

  it('computes the overall average and letter, rounding to the nearest grade', () => {
    const md = buildMarkdownReport([
      { question: 'Q1', answer: 'A1', grade: 5 },
      { question: 'Q2', answer: 'A2', grade: 2 },
    ]);
    // (5 + 2) / 2 = 3.5 -> displayed as 3.5, rounded to 4 -> letter B
    expect(md).toContain('- **Overall average:** 3.5/5 (B)');
  });

  it('formats a graded question block with its grade text and justification', () => {
    const md = buildMarkdownReport([
      { question: QUESTION_POOL[0], answer: 'my answer', grade: 5, justification: 'good' },
    ]);
    expect(md).toContain('## Question 1');
    expect(md).toContain(`**Q:** ${QUESTION_POOL[0]}`);
    expect(md).toContain('**A:** my answer');
    expect(md).toContain('**Grade:** 5/5 (A) — PASS');
    expect(md).toContain('good');
  });

  it('includes the model answer for a pooled question, coloured with the palette', () => {
    const md = buildMarkdownReport([
      { question: QUESTION_POOL[0], answer: 'a', grade: 3, justification: 'ok' },
    ]);
    expect(md).toContain('**Correct Answer:**');
    expect(md).toContain(
      `<span style="color: #b0e0e6">${ANSWER_POOL[0]}</span>`
    );
  });

  it('shows N/A and a justification placeholder when a grade is missing', () => {
    const md = buildMarkdownReport([
      { question: 'A freeform question not in the pool', answer: 'a', grade: undefined },
    ]);
    expect(md).toContain('**Grade:** N/A');
    expect(md).toContain('_(no justification returned)_');
  });

  it('does not emit a correct-answer block for questions outside the pool', () => {
    const md = buildMarkdownReport([
      { question: 'A freeform question not in the pool', answer: 'a', grade: 4, justification: 'j' },
    ]);
    const occurrences = md.split('**Correct Answer:**').length - 1;
    expect(occurrences).toBe(0);
  });

  it('prefers an explicit correctAnswer on the result over a pool lookup', () => {
    const md = buildMarkdownReport([
      {
        question: 'A freeform question not in the pool',
        answer: 'a',
        grade: 4,
        justification: 'j',
        correctAnswer: 'explicit model answer',
      },
    ]);
    expect(md).toContain(
      '<span style="color: #b0e0e6">explicit model answer</span>'
    );
  });

  it('emits one question block per result', () => {
    const md = buildMarkdownReport([
      { question: 'Q1', answer: 'A1', grade: 5, justification: 'a' },
      { question: 'Q2', answer: 'A2', grade: 4, justification: 'b' },
      { question: 'Q3', answer: 'A3', grade: 3, justification: 'c' },
    ]);
    expect(md).toContain('## Question 1');
    expect(md).toContain('## Question 2');
    expect(md).toContain('## Question 3');
    expect(md).toContain('- **Questions graded:** 3');
  });
});
