import { gradeStyleFor, GRADE_STYLE, gradeOne } from '../grading';
import { COLORS } from '../../../theme/colors';

describe('gradeStyleFor', () => {
  it.each([
    [5, 'A', 'PASS', '#4dff6a'],
    [4, 'B', 'PASS', '#8fef4d'],
    [3, 'C', 'WARN', '#ffd866'],
    [2, 'D', 'WARN', '#ffa657'],
    [1, 'F', 'FAIL', '#ff5c5c'],
  ])('maps grade %i to %s/%s', (grade, letter, label, color) => {
    expect(gradeStyleFor(grade)).toEqual({ letter, color, label });
  });

  it('returns the same object references defined in GRADE_STYLE', () => {
    expect(gradeStyleFor(5)).toBe(GRADE_STYLE[5]);
  });

  it.each([[0], [6], [99], [null], [undefined], ['x']])(
    'falls back to the N/A style for out-of-range grade %p',
    (grade) => {
      expect(gradeStyleFor(grade)).toEqual({
        letter: 'N/A',
        color: COLORS.textMuted,
        label: '----',
      });
    }
  );
});

describe('gradeOne', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  it('POSTs the question/answer to /api/grade and returns the parsed JSON', async () => {
    const responseBody = { grade: 4, justification: 'solid' };
    const json = jest.fn().mockResolvedValue(responseBody);
    global.fetch = jest.fn().mockResolvedValue({ json });

    const result = await gradeOne('What is DNS?', 'It resolves names.');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/api/grade');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(options.body)).toEqual({
      question: 'What is DNS?',
      answer: 'It resolves names.',
    });
    expect(result).toEqual(responseBody);
  });

  it('propagates a rejected fetch (network error)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));
    await expect(gradeOne('q', 'a')).rejects.toThrow('network down');
  });
});
