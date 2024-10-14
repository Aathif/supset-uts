import React from 'react';
import { render } from '@testing-library/react';
import PivotTable from './PivotTable'; // Import your component
import { TableRenderer } from './TableRenderer'; // Assuming TableRenderer is also imported

// Mock the TableRenderer component
jest.mock('./TableRenderer', () => ({
  TableRenderer: jest.fn(() => <div>Mocked TableRenderer</div>),
}));

describe('PivotTable component', () => {
  it('should render the TableRenderer component and pass props', () => {
    const testProps = {
      data: [1, 2, 3],
      otherProp: 'test',
    };

    // Render the PivotTable component
    const { getByText } = render(<PivotTable {...testProps} />);

    // Ensure the mocked TableRenderer is rendered
    expect(getByText('Mocked TableRenderer')).toBeInTheDocument();

    // Ensure TableRenderer was called with the correct props
    expect(TableRenderer).toHaveBeenCalledWith(expect.objectContaining(testProps), {});
  });
});
