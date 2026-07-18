import {
  QUESTION_POOL,
  ANSWER_POOL,
  getCorrectAnswer,
} from '../questionPool';

describe('question / answer pools', () => {
  it('are non-empty', () => {
    expect(QUESTION_POOL.length).toBeGreaterThan(0);
    expect(ANSWER_POOL.length).toBeGreaterThan(0);
  });

  it('are index-aligned (equal length)', () => {
    expect(ANSWER_POOL).toHaveLength(QUESTION_POOL.length);
  });

  it('contain only non-empty question strings', () => {
    QUESTION_POOL.forEach((q) => {
      expect(typeof q).toBe('string');
      expect(q.trim().length).toBeGreaterThan(0);
    });
  });

  it('contain only non-empty answer strings', () => {
    ANSWER_POOL.forEach((a) => {
      expect(typeof a).toBe('string');
      expect(a.trim().length).toBeGreaterThan(0);
    });
  });

  it('have unique question text (required for indexOf-based lookup)', () => {
    expect(new Set(QUESTION_POOL).size).toBe(QUESTION_POOL.length);
  });
});

describe('getCorrectAnswer', () => {
  it('returns the index-aligned answer for every pooled question', () => {
    QUESTION_POOL.forEach((question, i) => {
      expect(getCorrectAnswer(question)).toBe(ANSWER_POOL[i]);
    });
  });

  it('returns undefined for a question not in the pool', () => {
    expect(getCorrectAnswer('totally made up question')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(getCorrectAnswer('')).toBeUndefined();
  });
});
