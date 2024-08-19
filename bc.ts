import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterNewScheme from './FilterNewScheme';
import withToasts from 'src/components/MessageToasts/withToasts';

// Mock the `withToasts` HOC to simplify testing
jest.mock('src/components/MessageToasts/withToasts', () => (component) => component);

describe('FilterNewScheme', () => {
  const defaultProps = {
    show: true,
    onHide: jest.fn(),
    preparePayloadFilter: jest.fn(),
  };

  const renderComponent = (props = {}) =>
    render(<FilterNewScheme {...defaultProps} {...props} />);

  it('should render without crashing', () => {
    const { getByText } = renderComponent();
    expect(getByText('Save Filter Scheme')).toBeInTheDocument();
  });

  it('should update state when input value changes', () => {
    const { getByLabelText } = renderComponent();

    const filterNameInput = getByLabelText('Filter Name');
    fireEvent.change(filterNameInput, { target: { value: 'Test Filter' } });

    expect(filterNameInput.value).toBe('Test Filter');
  });

  it('should update state when checkbox is toggled', () => {
    const { getByLabelText } = renderComponent();

    const defaultCheckbox = getByLabelText('Make as Default Filter Scheme');
    fireEvent.click(defaultCheckbox);

    expect(defaultCheckbox.checked).toBe(true);

    fireEvent.click(defaultCheckbox);
    expect(defaultCheckbox.checked).toBe(false);
  });

  it('should call onHide when cancel button is clicked', () => {
    const { getByText } = renderComponent();

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(defaultProps.onHide).toHaveBeenCalled();
  });

  it('should call preparePayloadFilter with the correct data when save button is clicked', () => {
    const { getByText, getByLabelText } = renderComponent();

    const filterNameInput = getByLabelText('Filter Name');
    fireEvent.change(filterNameInput, { target: { value: 'Test Filter' } });

    const saveButton = getByText('Save');
    fireEvent.click(saveButton);

    expect(defaultProps.preparePayloadFilter).toHaveBeenCalledWith({
      name: 'Test Filter',
      public: false,
      default: false,
    });
  });
});
