import { downloadFile } from '../downloadFile';

describe('downloadFile', () => {
  let createObjectURL;
  let revokeObjectURL;
  let anchor;
  let createElementSpy;
  let appendChildSpy;
  let removeChildSpy;

  beforeEach(() => {
    // jsdom does not implement the object-URL APIs, so provide mocks.
    createObjectURL = jest.fn(() => 'blob:mock-url');
    revokeObjectURL = jest.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    anchor = { href: '', download: '', click: jest.fn() };
    createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation((tag) => {
        if (tag === 'a') return anchor;
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });
    appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node) => node);
    removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation((node) => node);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a Blob object URL and triggers a click on a download anchor', () => {
    downloadFile('report.md', '# hello', 'text/markdown;charset=utf-8');

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = createObjectURL.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('text/markdown;charset=utf-8');

    expect(anchor.download).toBe('report.md');
    expect(anchor.href).toBe('blob:mock-url');
    expect(anchor.click).toHaveBeenCalledTimes(1);
  });

  it('appends the anchor, then removes it and revokes the URL (cleanup)', () => {
    downloadFile('notes.txt', 'body');

    expect(appendChildSpy).toHaveBeenCalledWith(anchor);
    expect(removeChildSpy).toHaveBeenCalledWith(anchor);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('defaults to a plain-text mime type when none is given', () => {
    downloadFile('notes.txt', 'body');
    const blobArg = createObjectURL.mock.calls[0][0];
    expect(blobArg.type).toBe('text/plain;charset=utf-8');
  });
});
