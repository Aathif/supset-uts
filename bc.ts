import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ColumnConfigPopover from './ColumnConfigPopover';
import { GenericDataType } from '@superset-ui/core';
import { SHARED_COLUMN_CONFIG_PROPS } from './constants';

describe('ColumnConfigPopover', () => {
  const defaultProps = {
    column: {
      type: GenericDataType.String,
      config: {},
    },
    configFormLayout: {
      [GenericDataType.String]: [
        ['prop1', 'prop2'],
        [{ name: 'prop3', config: {} }],
      ],
    },
    onChange: jest.fn(),
    cols: 24,
  };

  it('renders the correct number of ControlFormItems', () => {
    render(<ColumnConfigPopover {...defaultProps} />);

    // Check if ControlFormItems with prop1, prop2, and prop3 are rendered
    expect(screen.getByRole('textbox', { name: /prop1/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /prop2/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /prop3/i })).toBeInTheDocument();
  });

  it('calls onChange when a form item is changed', () => {
    render(<ColumnConfigPopover {...defaultProps} />);

    const input = screen.getByRole('textbox', { name: /prop1/i });
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('applies shared column config props correctly', () => {
    const modifiedProps = {
      ...defaultProps,
      configFormLayout: {
        [GenericDataType.String]: [['prop1']],
      },
    };

    render(<ColumnConfigPopover {...modifiedProps} />);

    // Check if the props from SHARED_COLUMN_CONFIG_PROPS are applied
    const sharedProps = SHARED_COLUMN_CONFIG_PROPS['prop1'];
    expect(screen.getByRole('textbox', { name: /prop1/i })).toHaveAttribute(
      'placeholder',
      sharedProps?.placeholder || ''
    );
  });

  it('renders correct form layout based on column type', () => {
    const modifiedProps = {
      ...defaultProps,
      column: {
        type: GenericDataType.Number,
        config: {},
      },
      configFormLayout: {
        [GenericDataType.Number]: [['numericProp1']],
      },
    };

    render(<ColumnConfigPopover {...modifiedProps} />);

    // Check if ControlFormItem with numericProp1 is rendered based on Number type
    expect(
      screen.getByRole('textbox', { name: /numericProp1/i })
    ).toBeInTheDocument();
  });

  it('handles undefined column type by defaulting to GenericDataType.String', () => {
    const modifiedProps = {
      ...defaultProps,
      column: {
        type: undefined,
        config: {},
      },
    };

    render(<ColumnConfigPopover {...modifiedProps} />);

    // Check if it defaults to GenericDataType.String and renders the correct form layout
    expect(screen.getByRole('textbox', { name: /prop1/i })).toBeInTheDocument();
  });
});
