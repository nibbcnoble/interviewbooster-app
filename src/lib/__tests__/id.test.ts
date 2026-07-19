import { nextId, makeLine } from '../id';

describe('nextId', () => {
  it('returns ids in the "l<number>" format', () => {
    expect(nextId()).toMatch(/^l\d+$/);
  });

  it('increments the numeric suffix on each call', () => {
    const first = parseInt(nextId().slice(1), 10);
    const second = parseInt(nextId().slice(1), 10);
    expect(second).toBe(first + 1);
  });

  it('never returns the same id twice in a row', () => {
    const a = nextId();
    const b = nextId();
    expect(a).not.toBe(b);
  });
});

describe('makeLine', () => {
  it('builds a line object with a generated id, kind, and content', () => {
    const line = makeLine('ok', 'hello');
    expect(line).toEqual({
      id: expect.stringMatching(/^l\d+$/),
      kind: 'ok',
      content: 'hello',
    });
  });

  it('gives each line a unique id', () => {
    const a = makeLine('output', 'a');
    const b = makeLine('output', 'b');
    expect(a.id).not.toBe(b.id);
  });

  it('preserves non-string content payloads', () => {
    const payload = { index: 1, total: 5, text: 'q' };
    const line = makeLine('question', payload);
    expect(line.kind).toBe('question');
    expect(line.content).toBe(payload);
  });
});
