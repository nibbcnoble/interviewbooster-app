import { COLORS } from '../../theme/colors';

export interface GradeStyle {
  letter: string;
  color: string;
  label: string;
}

export const GRADE_STYLE: Record<number, GradeStyle> = {
  5: { letter: 'A', color: '#4dff6a', label: 'PASS' },
  4: { letter: 'B', color: '#8fef4d', label: 'PASS' },
  3: { letter: 'C', color: '#ffd866', label: 'WARN' },
  2: { letter: 'D', color: '#ffa657', label: 'WARN' },
  1: { letter: 'F', color: '#ff5c5c', label: 'FAIL' },
};

export const gradeStyleFor = (grade: number | null | undefined): GradeStyle =>
  (grade !== null && grade !== undefined ? GRADE_STYLE[grade] : undefined) || {
    letter: 'N/A',
    color: COLORS.textMuted,
    label: '----',
  };

export interface GradeResult {
  grade: number;
  justification?: string;
  raw?: string;
}

export const gradeOne = async (q: string, a: string): Promise<GradeResult> => {
  const response = await fetch(`/api/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: q, answer: a }),
  });
  return response.json();
};
