import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FormattingPopover } from './FormattingPopover';
import { getChartDataRequest } from 'src/components/Chart/chartAction';

// Mock the getChartDataRequest function
jest.mock('src/components/Chart/chartAction', () => ({
  getChartDataRequest: jest.fn(),
}));

// Mock children component
const MockChildren = () => <div>Mock Child</div>;

describe('FormattingPopover', () => {
  const defaultProps = {
    title: 'Test Title',
    columns: [],
    datasource: {},
    onChange: jest.fn(),
    config: {},
    formData: {},
    controls: {},
    groupByOptions: [],
    children: <MockChildren />,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the popover with title', () => {
    render(<FormattingPopover {...defaultProps} />);
    fireEvent.click(screen.getByText('Mock Child')); // Trigger the popover to show
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('sets visibility to true when children are clicked', () => {
    render(<FormattingPopover {...defaultProps} />);
    fireEvent.click(screen.getByText('Mock Child')); // Trigger the popover to show
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls makeRequest when config is available and popover becomes visible', async () => {
    const config = { tenantId: 1, queryMode: 'aggregate' };
    const mockFormData = { query_mode: 'aggregate' };

    render(<FormattingPopover {...defaultProps} config={config} formData={mockFormData} />);

    fireEvent.click(screen.getByText('Mock Child')); // Trigger the popover to show

    await waitFor(() => {
      expect(getChartDataRequest).toHaveBeenCalledWith(expect.objectContaining({
        formData: expect.objectContaining({
          tenant_id: 1,
          query_mode: 'aggregate',
        }),
      }));
    });
  });

  it('updates state correctly onColumnChange for "groupby"', () => {
    render(<FormattingPopover {...defaultProps} />);

    fireEvent.click(screen.getByText('Mock Child')); // Trigger the popover to show
    fireEvent.change(screen.getByText('Mock Child'), { target: { value: 'groupby' } }); // Simulate column change

    expect(getChartDataRequest).toHaveBeenCalled();
  });

  it('calls onChange with the correct configuration on handleSave', () => {
    const onChangeMock = jest.fn();
    const config = { tenantId: 1, queryMode: 'aggregate' };

    render(<FormattingPopover {...defaultProps} config={config} onChange={onChangeMock} />);

    fireEvent.click(screen.getByText('Mock Child')); // Trigger the popover to show

    fireEvent.click(screen.getByText('Save')); // Simulate clicking save button

    expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({
      tenantId: 1,
    }));
  });

  it('handles request errors gracefully in makeRequest', async () => {
    getChartDataRequest.mockImplementation(() => {
      throw new Error('Request failed');
    });

    const config = { tenantId: 1, queryMode: 'aggregate' };
    const mockFormData = { query_mode: 'aggregate' };

    render(<FormattingPopover {...defaultProps} config={config} formData={mockFormData} />);

    fireEvent.click(screen.getByText('Mock Child')); // Trigger the popover to show

    await waitFor(() => {
      expect(getChartDataRequest).toHaveBeenCalled();
    });
  });
});
