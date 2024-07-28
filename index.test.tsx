// ControlFormItem.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useTheme } from '@superset-ui/core';
import ControlFormItem, { ControlFormItemComponents } from './ControlFormItem';
import ControlHeader from '../ControlHeader';
import InfoTooltipWithTrigger from '../InfoTooltipWithTrigger';

// Mock necessary modules
jest.mock('@superset-ui/core', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../ControlHeader', () => jest.fn(() => <div>ControlHeader</div>));
jest.mock('../InfoTooltipWithTrigger', () => jest.fn(() => <div>Tooltip</div>));

const MockControlComponent = ({ value, onChange }) => (
  <input
    data-testid="mock-control"
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

ControlFormItemComponents.Checkbox = ({ children, checked, onChange }) => (
  <div>
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e)}
    />
    {children}
  </div>
);

ControlFormItemComponents.Select = MockControlComponent;

describe('ControlFormItem', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ gridUnit: 4 });
  });

  it('renders and handles change for a Checkbox control', () => {
    const handleChange = jest.fn();
    render(
      <ControlFormItem
        name="test-checkbox"
        label="Test Checkbox"
        description="This is a test checkbox"
        width={200}
        controlType="Checkbox"
        initialValue={false}
        onChange={handleChange}
      />
    );

    // Check if ControlHeader and Checkbox are rendered
    expect(screen.getByText('ControlHeader')).toBeInTheDocument();
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('renders and handles change for a Select control', () => {
    const handleChange = jest.fn();
    render(
      <ControlFormItem
        name="test-select"
        label="Test Select"
        description="This is a test select"
        width={200}
        controlType="Select"
        initialValue="initial"
        onChange={handleChange}
        cols={['Option 1', 'Option 2']}
      />
    );

    // Check if ControlHeader and Select are rendered
    expect(screen.getByText('ControlHeader')).toBeInTheDocument();
    const input = screen.getByTestId('mock-control');
    fireEvent.change(input, { target: { value: 'changed' } });

    expect(handleChange).toHaveBeenCalledWith('changed');
  });

  it('renders InfoTooltipWithTrigger on hover', () => {
    render(
      <ControlFormItem
        name="test-tooltip"
        label="Test Tooltip"
        description="This is a tooltip"
        width={200}
        controlType="Checkbox"
        initialValue={false}
      />
    );

    const checkboxLabel = screen.getByText('Test Checkbox');
    fireEvent.mouseEnter(checkboxLabel);

    expect(screen.getByText('Tooltip')).toBeInTheDocument();
  });
});
