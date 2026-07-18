import {
  shuffleArray,
  normalizeQuestions,
  calculateScore,
} from '../modules/study/PracticeTestApp';

describe('shuffleArray', () => {
  beforeAll(() => {
    // make Math.random deterministic
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterAll(() => {
    Math.random.mockRestore();
  });

  it('returns a new array with same members in (pseudo)random order', () => {
    const arr = [1, 2, 3, 4];
    const shuffled = shuffleArray(arr);
    expect(shuffled).not.toBe(arr);           // not the same reference
    expect(shuffled.sort()).toEqual(arr.sort()); // same contents
  });
});

describe('normalizeQuestions', () => {
  const IDK = "I don't know";
  const raw = [
    {
      _id: 'aaa',
      question_type: 'mc',
      options: ['opt1', 'opt2', IDK],
      correct_answer: 'opt1',
      domain: 'X',
    },
    {
      id: 'bbb',
      question_type: 'tf',
      correct_answer: 'True',
      domain: 'Y',
    },
  ];

  it('preserves order when preserveOptionOrder=true', () => {
    const out = normalizeQuestions(raw, true);
    // first question: mc
    expect(out[0].options).toEqual(['opt1', 'opt2', IDK]);
    // second: tf
    expect(out[1].options).toEqual(['True', 'False', IDK]);
    // generated ids
    expect(out[0].id).toBe('aaa');
    expect(out[1].id).toBe('bbb');
  });

  it('shuffles order when preserveOptionOrder=false', () => {
    // with Math.random=0 (see shuffleArray test), shuffleArray is deterministic identity
    const out = normalizeQuestions(raw, false);
    expect(out[0].options).toEqual(['opt1', 'opt2', IDK]);
    expect(out[1].options).toEqual(['True', 'False', IDK]);
  });
});

describe('calculateScore', () => {
  const qs = [
    { id: 'q1', correct_answer: 'A', domain: 'D1' },
    { id: 'q2', correct_answer: 'B', domain: 'D1' },
    { id: 'q3', correct_answer: 'C', domain: 'D2' },
  ];
  const answers = { q1: 'A', q2: 'X', q3: 'C' };
  it('tallies total, correct, percent, and byDomain', () => {
    const score = calculateScore(qs, answers);
    expect(score.total).toBe(3);
    expect(score.correct).toBe(2);
    expect(score.percent).toBe(Math.round((2 / 3) * 100));
    expect(score.byDomain).toEqual({
      D1: { total: 2, correct: 1 },
      D2: { total: 1, correct: 1 },
    });
  });
});
