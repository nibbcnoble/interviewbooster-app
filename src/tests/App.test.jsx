import { buildInitialLog } from '../App';

describe('buildInitialLog', () => {
  const BANNER0 =
    'Welcome, this is a shell for my ai projects.  See the docs for how this works.';
  const TIP =
    'tip: use ↑ / ↓ to move through command history';

  it('calls makeLine for each banner, core help, module help, blank, and tip', () => {
    // two dummy modules
    const modules = [
      { helpLines: ['m1-a', 'm1-b'] },
      { helpLines: ['m2-x'] },
    ];
    const makeLine = jest.fn((type, text) => ({ type, text }));

    const lines = buildInitialLog(makeLine, modules);

    // first call is the first banner line:
    expect(makeLine).toHaveBeenCalledWith('help', BANNER0);

    // last call is the TIP_LINE
    expect(makeLine).toHaveBeenLastCalledWith('help', TIP);

    // total count: 
    //   3 banner lines + 3 core help lines + 3 module‐help lines + 1 blank + 1 tip
    const expectedLength = 3 + 3 + (2 + 1) + 1 + 1;
    expect(lines).toHaveLength(expectedLength);

    // ensure every returned item came from makeLine
    expect(lines.every((l) => l.type === 'help')).toBe(true);
    expect(lines.map((l) => l.text)).toContain('m1-a');
    expect(lines.map((l) => l.text)).toContain('m2-x');
    expect(lines.map((l) => l.text)).toContain('');
  });
});
