import { COLORS } from '../../theme/colors';

export const GRADE_STYLE = {
  5: { letter: 'A', color: '#4dff6a', label: 'PASS' },
  4: { letter: 'B', color: '#8fef4d', label: 'PASS' },
  3: { letter: 'C', color: '#ffd866', label: 'WARN' },
  2: { letter: 'D', color: '#ffa657', label: 'WARN' },
  1: { letter: 'F', color: '#ff5c5c', label: 'FAIL' },
};

export const gradeStyleFor = (grade) =>
  GRADE_STYLE[grade] || { letter: 'N/A', color: COLORS.textMuted, label: '----' };

export const gradeOne = async (q, a) => {
  const response = await fetch(`/api/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: q, answer: a }),
  });
  return response.json();
};
