import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Terminal from './Terminal';

// a minimal stub for TerminalLine so it doesn’t crash
jest.mock('./TerminalLine', () => (props) => (
  <div data-testid="line">{props.line.text}</div>
));

describe('<Terminal />', () => {
  it('renders log lines, badge, prompt, placeholder, and input enabled/disabled', () => {
    const log = [
      { id: '1', text: 'foo', type: 'output' },
      { id: '2', text: 'bar', type: 'error' },
    ];
    const scrollRef = createRef();
    let value = 'hello';
    const setInput = (v) => {
      value = v;
    };
    const onKeyDown = jest.fn();
    const inputRef = createRef();
    const focusInput = jest.fn();

    const { getByPlaceholderText, getByText, getAllByTestId } = render(
      <Terminal
        log={log}
        scrollRef={scrollRef}
        input={value}
        setInput={setInput}
        busy={false}
        onKeyDown={onKeyDown}
        inputRef={inputRef}
        focusInput={focusInput}
        badge="🛑"
        promptLabel=">"
        placeholder="say hi"
      />
    );

    // badge appears
    expect(getByText('🛑')).toBeInTheDocument();

    // prompt label appears
    expect(getByText('>')).toBeInTheDocument();

    // placeholder for input
    const input = getByPlaceholderText('say hi');
    expect(input).toBeEnabled();

    // lines render
    const renderedLines = getAllByTestId('line').map((n) => n.textContent);
    expect(renderedLines).toEqual(['foo', 'bar']);

    // clicking container calls focusInput
    fireEvent.click(input.parentElement.parentElement.parentElement);
    expect(focusInput).toHaveBeenCalled();
  });

  it('disables input and changes placeholder when busy', () => {
    const { getByPlaceholderText } = render(
      <Terminal
        log={[]}
        scrollRef={createRef()}
        input=""
        setInput={() => {}}
        busy={true}
        onKeyDown={() => {}}
        inputRef={createRef()}
        focusInput={() => {}}
      />
    );
    const input = getByPlaceholderText('working…');
    expect(input).toBeDisabled();
  });
});
