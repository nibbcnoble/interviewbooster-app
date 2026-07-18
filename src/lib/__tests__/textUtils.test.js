import { extractQuoted, shuffle } from '../textUtils';

describe('extractQuoted', () => {
  it('pulls the first double-quoted substring out of a command', () => {
    expect(extractQuoted('interview -q "What is DNS?"')).toBe('What is DNS?');
  });

  it('returns only the first quoted segment when several are present', () => {
    expect(extractQuoted('say "hello" then "goodbye"')).toBe('hello');
  });

  it('matches an empty quoted segment as an empty string', () => {
    expect(extractQuoted('prefix "" suffix')).toBe('');
  });

  it('falls back to the trimmed raw string when there is no quoted segment', () => {
    expect(extractQuoted('   plain text   ')).toBe('plain text');
  });

  it('returns an empty string for an empty input', () => {
    expect(extractQuoted('')).toBe('');
  });
});

describe('shuffle', () => {
  it('returns a new array and does not mutate the original', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).not.toBe(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('preserves length and the exact multiset of elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces a deterministic order when Math.random is stubbed', () => {
    // With Math.random pinned to 0, Fisher-Yates always picks j = 0, so each
    // step swaps the current tail element into index 0.
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    try {
      expect(shuffle([1, 2, 3])).toEqual([2, 3, 1]);
    } finally {
      spy.mockRestore();
    }
  });
});
