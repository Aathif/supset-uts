import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColumnConfigPopover from './ColumnConfigPopover';
import { GenericDataType } from '@superset-ui/core';
import { Tabs } from 'src/components';
import { SHARED_COLUMN_CONFIG_PROPS } from './constants';

// Mock the ControlForm, ControlFormRow, and ControlFormItem
jest.mock('./ControlForm', () => ({
  ControlForm: ({ children }) => <div>{children}</div>,
  ControlFormRow: ({ children }) => <div>{children}</div>,
  ControlFormItem: ({ name, ...props }) => (
    <div data-testid={`form-item-${name}`} {...props}>
      {name}
    </div>
  ),
}));

describe('ColumnConfigPopover', () => {
  const mockOnChange = jest.fn();
  const column = {
    type: GenericDataType.String,
    config: {},
  };
  const configFormLayout = {
    [GenericDataType.String]: [
      [{ name: 'column1' }, { name: 'column2' }],
      [{ name: 'column3' }],
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <ColumnConfigPopover
        column={column}
        configFormLayout={configFormLayout}
        onChange={mockOnChange}
      />
    );

    // Ensure that the form items render correctly
    expect(screen.getByTestId('form-item-column1')).toBeInTheDocument();
    expect(screen.getByTestId('form-item-column2')).toBeInTheDocument();
    expect(screen.getByTestId('form-item-column3')).toBeInTheDocument();
  });

  it('renders tabs when layout contains tabs', () => {
    const tabbedConfigFormLayout = {
      [GenericDataType.String]: [
        {
          tab: 'Tab 1',
          children: [[{ name: 'tabColumn1' }]],
        },
        {
          tab: 'Tab 2',
          children: [[{ name: 'tabColumn2' }]],
        },
      ],
    };

    render(
      <ColumnConfigPopover
        column={column}
        configFormLayout={tabbedConfigFormLayout}
        onChange={mockOnChange}
      />
    );

    // Ensure Tabs are rendered
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();

    // Ensure form items within tabs are rendered
    fireEvent.click(screen.getByText('Tab 1'));
    expect(screen.getByTestId('form-item-tabColumn1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByTestId('form-item-tabColumn2')).toBeInTheDocument();
  });

  it('calls onChange when a form item changes', () => {
    const configFormLayoutWithSharedProps = {
      [GenericDataType.String]: [
        [{ name: 'sharedColumn1' }, { name: 'sharedColumn2' }],
      ],
    };

    render(
      <ColumnConfigPopover
        column={column}
        configFormLayout={configFormLayoutWithSharedProps}
        onChange={mockOnChange}
      />
    );

    // Simulate a change event on a form item
    const formItem = screen.getByTestId('form-item-sharedColumn1');
    fireEvent.change(formItem, { target: { value: 'new value' } });

    // Check if onChange is called with the expected new value
    expect(mockOnChange).toHaveBeenCalled();
  });
});
