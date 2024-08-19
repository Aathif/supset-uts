import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScheduleQueryButton from './ScheduleQueryButton';

// Mock dependencies
jest.mock('@superset-ui/core', () => ({
  t: (str: string) => str, // Mock translation function
  styled: (component: any) => component,
}));

jest.mock('src/utils/getBootstrapData', () => () => ({
  common: {
    conf: {
      SCHEDULED_QUERIES: {
        JSONSCHEMA: {
          properties: {
            schedule_type: {
              type: 'string',
              default: 'daily',
              format: 'date-time',
            },
          },
        },
        UISCHEMA: {},
        VALIDATION: [],
      },
    },
  },
}));

describe('ScheduleQueryButton', () => {
  const defaultProps = {
    defaultLabel: 'Test Query',
    sql: 'SELECT * FROM table',
    schema: 'public',
    dbId: 1,
    onSchedule: jest.fn(),
    scheduleQueryWarning: 'Test Warning',
    tooltip: 'Tooltip Text',
    disabled: false,
  };

  it('renders the schedule button', () => {
    render(<ScheduleQueryButton {...defaultProps} />);
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });

  it('opens the modal when the schedule button is clicked', () => {
    render(<ScheduleQueryButton {...defaultProps} />);
    fireEvent.click(screen.getByText('Schedule'));
    expect(screen.getByText('Schedule query')).toBeInTheDocument();
  });

  it('renders label and description inputs', () => {
    render(<ScheduleQueryButton {...defaultProps} />);
    fireEvent.click(screen.getByText('Schedule'));
    
    expect(screen.getByLabelText('Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('allows label and description to be set', () => {
    render(<ScheduleQueryButton {...defaultProps} />);
    fireEvent.click(screen.getByText('Schedule'));

    const labelInput = screen.getByLabelText('Label');
    const descriptionInput = screen.getByLabelText('Description');

    fireEvent.change(labelInput, { target: { value: 'My Label' } });
    fireEvent.change(descriptionInput, { target: { value: 'My Description' } });

    expect(labelInput).toHaveValue('My Label');
    expect(descriptionInput).toHaveValue('My Description');
  });

  it('calls onSchedule with the correct data on submit', async () => {
    const mockOnSchedule = jest.fn();
    render(<ScheduleQueryButton {...defaultProps} onSchedule={mockOnSchedule} />);
    fireEvent.click(screen.getByText('Schedule'));

    // Set values in the form
    fireEvent.change(screen.getByLabelText('Label'), { target: { value: 'New Label' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Description' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockOnSchedule).toHaveBeenCalledWith({
        label: 'New Label',
        description: 'New Description',
        db_id: 1,
        schema: 'public',
        sql: 'SELECT * FROM table',
        extra_json: JSON.stringify({ schedule_info: {} }),
      });
    });
  });

  it('displays the schedule query warning', () => {
    render(<ScheduleQueryButton {...defaultProps} />);
    fireEvent.click(screen.getByText('Schedule'));

    expect(screen.getByText('Test Warning')).toBeInTheDocument();
  });

  it('renders the button as disabled when the disabled prop is true', () => {
    render(<ScheduleQueryButton {...defaultProps} disabled />);
    const scheduleButton = screen.getByText('Schedule');
    expect(scheduleButton).toBeDisabled();
  });

  it('does not open the modal when the button is disabled', () => {
    render(<ScheduleQueryButton {...defaultProps} disabled />);
    const scheduleButton = screen.getByText('Schedule');
    fireEvent.click(scheduleButton);
    expect(screen.queryByText('Schedule query')).not.toBeInTheDocument();
  });
});
