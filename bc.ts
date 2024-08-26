import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShowSQL from './ShowSQL';
import ModalTrigger from 'src/components/ModalTrigger';
import { IconTooltip } from 'src/components/IconTooltip';

jest.mock('react-syntax-highlighter/dist/cjs/light', () => ({
  registerLanguage: jest.fn(),
  default: ({ children }) => <div data-testid="syntax-highlighter">{children}</div>,
}));

jest.mock('src/components/ModalTrigger', () => jest.fn(({ triggerNode, modalBody }) => (
  <div>
    <div data-testid="trigger-node" onClick={() => setIsOpen(true)}>
      {triggerNode}
    </div>
    {modalBody}
  </div>
)));

jest.mock('src/components/IconTooltip', () => jest.fn(({ tooltip }) => (
  <div data-testid="icon-tooltip">{tooltip}</div>
)));

describe('ShowSQL Component', () => {
  const sqlString = 'SELECT * FROM table;';
  const tooltipText = 'Show SQL';
  const title = 'SQL Query';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the IconTooltip with the correct tooltip text', () => {
    render(<ShowSQL tooltipText={tooltipText} title={title} sql={sqlString} />);
    expect(screen.getByTestId('icon-tooltip')).toHaveTextContent(tooltipText);
  });

  it('renders the ModalTrigger with the correct modal title', () => {
    render(<ShowSQL tooltipText={tooltipText} title={title} sql={sqlString} />);
    const modalTrigger = screen.getByTestId('trigger-node');
    expect(modalTrigger).toBeInTheDocument();
  });

  it('renders the SQL code inside the SyntaxHighlighter', () => {
    render(<ShowSQL tooltipText={tooltipText} title={title} sql={sqlString} />);
    expect(screen.getByTestId('syntax-highlighter')).toHaveTextContent(sqlString);
  });

  it('opens the modal and displays SQL when the IconTooltip is clicked', () => {
    render(<ShowSQL tooltipText={tooltipText} title={title} sql={sqlString} />);
    fireEvent.click(screen.getByTestId('trigger-node'));
    expect(screen.getByTestId('syntax-highlighter')).toHaveTextContent(sqlString);
  });
});
