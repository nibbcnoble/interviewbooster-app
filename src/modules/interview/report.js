import { COLORS } from '../../theme/colors';
import { gradeStyleFor } from './grading';
import { getCorrectAnswer } from './questionPool';

export const buildMarkdownReport = (results) => {
  const now = new Date();
  const gradesGiven = results.filter((r) => typeof r.grade === 'number');
  const avg = gradesGiven.length
    ? gradesGiven.reduce((sum, r) => sum + r.grade, 0) / gradesGiven.length
    : null;

  const lines = [];
  lines.push('# Interview Grading Report');
  lines.push('');
  lines.push(`- **Generated:** ${now.toLocaleString()}`);
  lines.push(`- **Questions graded:** ${results.length}`);
  if (avg !== null) {
    const overallStyle = gradeStyleFor(Math.round(avg));
    lines.push(`- **Overall average:** ${avg.toFixed(1)}/5 (${overallStyle.letter})`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  results.forEach((r, i) => {
    const style = gradeStyleFor(r.grade);
    const gradeText =
      typeof r.grade === 'number' ? `${r.grade}/5 (${style.letter}) — ${style.label}` : 'N/A';

    lines.push(`## Question ${i + 1}`);
    lines.push('');
    lines.push(`**Q:** ${r.question}`);
    lines.push('');
    lines.push(`**A:** ${r.answer}`);
    lines.push('');
    lines.push(`**Grade:** ${gradeText}`);
    lines.push('');
    lines.push('**Justification:**');
    lines.push('');
    lines.push(r.justification || '_(no justification returned)_');
    lines.push('');

    const correctAnswer = r.correctAnswer || getCorrectAnswer(r.question);
    if (correctAnswer) {
      lines.push('**Correct Answer:**');
      lines.push('');
      lines.push(`<span style="color: ${COLORS.powderBlue}">${correctAnswer}</span>`);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
};
