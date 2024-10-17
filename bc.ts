import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedFrame } from './path-to-your-AdvancedFrame';
import { SEPARATOR } from 'src/explore/components/controls/DateFilterControl/utils';

// Mock necessary components
jest.mock('@superset-ui/core', () => ({
  t: jest.fn(str => str),
}));
jest.mock('src/explore/components/controls/DateFilterControl/utils', () => ({
  SEPARATOR: ' : ',
}));
jest.mock('src/components/Input', () => ({
  Input: ({ value, onChange }: any) => (
    <input value={value} onChange={e => onChange(e)} />
  ),
}));
jest.mock('@superset-ui/chart-controls', () => ({
  InfoTooltipWithTrigger: ({ tooltip }: { tooltip: string }) => <span>{tooltip}</span>,
}));

describe('AdvancedFrame', () => {
  const setup = (props: any) => {
    return render(<AdvancedFrame {...props} />);
  };

  it('should render the component with correct labels and tooltips', () => {
    setup({ value: '', onChange: jest.fn() });

    // Check for section title and labels
    expect(screen.getByText('Configure Advanced Time Range ')).toBeInTheDocument();
    expect(screen.getByText('START (INCLUSIVE)')).toBeInTheDocument();
    expect(screen.getByText('END (EXCLUSIVE)')).toBeInTheDocument();
    expect(screen.getByText('Start date included in time range')).toBeInTheDocument();
    expect(screen.getByText('End date excluded from time range')).toBeInTheDocument();
  });

  it('should initialize with the correct "since" and "until" values', () => {
    setup({ value: 'Last 7 days : Next 5 days', onChange: jest.fn() });

    // Verify the input values
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('Last 7 days'); // "since" input
    expect(inputs[1]).toHaveValue('Next 5 days'); // "until" input
  });

  it('should trigger onChange when "since" value is changed', () => {
    const onChangeMock = jest.fn();
    setup({ value: 'Last 7 days : Next 5 days', onChange: onChangeMock });

    const sinceInput = screen.getAllByRole('textbox')[0];

    // Simulate changing the "since" input
    fireEvent.change(sinceInput, { target: { value: 'Last 10 days' } });

    // Check that onChange was called with the updated value
    expect(onChangeMock).toHaveBeenCalledWith('Last 10 days : Next 5 days');
  });

  it('should trigger onChange when "until" value is changed', () => {
    const onChangeMock = jest.fn();
    setup({ value: 'Last 7 days : Next 5 days', onChange: onChangeMock });

    const untilInput = screen.getAllByRole('textbox')[1];

    // Simulate changing the "until" input
    fireEvent.change(untilInput, { target: { value: 'Next 10 days' } });

    // Check that onChange was called with the updated value
    expect(onChangeMock).toHaveBeenCalledWith('Last 7 days : Next 10 days');
  });

  it('should handle empty value by initializing "since" and "until" to empty strings', () => {
    setup({ value: '', onChange: jest.fn() });

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue(''); // "since" input should be empty
    expect(inputs[1]).toHaveValue(''); // "until" input should be empty
  });
});
