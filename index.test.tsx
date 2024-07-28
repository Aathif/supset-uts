import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { t } from '@superset-ui/core';
import ScheduleQueryButton from './ScheduleQueryButton';

// Mock necessary modules
jest.mock('@superset-ui/core', () => ({
  t: jest.fn().mockImplementation(str => str),
  styled: jest.fn().mockImplementation(component => component),
}));

jest.mock('chrono-node', () => ({
  parseDate: jest.fn().mockReturnValue(new Date().toISOString()),
}));

jest.mock('src/components/ModalTrigger', () => {
  return jest.fn(({ triggerNode, modalBody }) => (
    <div>
      {triggerNode}
      {modalBody}
    </div>
  ));
});

jest.mock('src/components/Input', () => ({
  Input: ({ value, onChange }) => (
    <input value={value} onChange={onChange} data-testid="input" />
  ),
  TextArea: ({ value, onChange }) => (
    <textarea value={value} onChange={onChange} data-testid="textarea" />
  ),
}));

describe('ScheduleQueryButton', () => {
  const mockProps = {
    defaultLabel: 'Test Label',
    sql: 'SELECT * FROM table',
    schema: 'public',
    dbId: 1,
    onSchedule: jest.fn(),
    scheduleQueryWarning: 'Warning message',
    tooltip: 'Tooltip message',
    disabled: false,
  };

  it('renders the ScheduleQueryButton with default props', () => {
    render(<ScheduleQueryButton {...mockProps} />);
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });

  it('opens the modal when Schedule button is clicked', () => {
    render(<ScheduleQueryButton {...mockProps} />);
    fireEvent.click(screen.getByText('Schedule'));
    expect(screen.getByPlaceholderText('Label for your query')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write a description for your query')).toBeInTheDocument();
  });

  it('submits the form with the correct values', () => {
    render(<ScheduleQueryButton {...mockProps} />);
    fireEvent.click(screen.getByText('Schedule'));

    fireEvent.change(screen.getByPlaceholderText('Label for your query'), {
      target: { value: 'New Label' },
    });
    fireEvent.change(screen.getByPlaceholderText('Write a description for your query'), {
      target: { value: 'New Description' },
    });

    fireEvent.click(screen.getByText('Submit'));

    expect(mockProps.onSchedule).toHaveBeenCalledWith({
      label: 'New Label',
      description: 'New Description',
      db_id: 1,
      schema: 'public',
      sql: 'SELECT * FROM table',
      extra_json: expect.any(String),
    });
  });

  it('displays the schedule query warning', () => {
    render(<ScheduleQueryButton {...mockProps} />);
    fireEvent.click(screen.getByText('Schedule'));
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('disables the button when disabled prop is true', () => {
    render(<ScheduleQueryButton {...mockProps} disabled />);
    expect(screen.getByText('Schedule')).toBeDisabled();
  });
});
