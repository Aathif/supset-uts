import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ShowSQL from './ShowSQL';
import ModalTrigger from 'src/components/ModalTrigger';

// Mock ModalTrigger component since we only need to test the ShowSQL component logic
jest.mock('src/components/ModalTrigger', () => ({
  __esModule: true,
  default: ({ modalTitle, modalBody, triggerNode }: any) => (
    <div>
      <div data-testid="modal-trigger">{triggerNode}</div>
      <div data-testid="modal-title">{modalTitle}</div>
      <div data-testid="modal-body">{modalBody}</div>
    </div>
  ),
}));

describe('ShowSQL', () => {
  const sqlQuery = 'SELECT * FROM users;';
  const title = 'View SQL Query';
  const tooltipText = 'Show SQL query';

  test('renders IconTooltip and triggers ModalTrigger on click', () => {
    render(<ShowSQL sql={sqlQuery} title={title} tooltipText={tooltipText} />);

    // Ensure that the IconTooltip is rendered
    const iconTooltip = screen.getByTestId('modal-trigger');
    expect(iconTooltip).toBeInTheDocument();

    // Simulate a click to trigger modal
    fireEvent.click(iconTooltip);

    // Ensure that the modal title and body are rendered correctly
    const modalTitle = screen.getByTestId('modal-title');
    const modalBody = screen.getByTestId('modal-body');
    
    expect(modalTitle).toHaveTextContent(title);
    expect(modalBody).toHaveTextContent(sqlQuery); // Ensure the SQL string is shown inside the modal
  });

  test('displays SQL query inside the syntax highlighter', () => {
    render(<ShowSQL sql={sqlQuery} title={title} tooltipText={tooltipText} />);

    // Simulate a click to trigger the modal
    const iconTooltip = screen.getByTestId('modal-trigger');
    fireEvent.click(iconTooltip);

    // Ensure that the SQL query is passed to SyntaxHighlighter
    const modalBody = screen.getByTestId('modal-body');
    expect(modalBody).toHaveTextContent('SELECT * FROM users;');
  });
});
