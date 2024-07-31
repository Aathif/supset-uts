import React from 'react';
import { render } from '@testing-library/react';
import EchartsMixedTimeseries from './EchartsMixedTimeseries';

describe('EchartsMixedTimeseries', () => {
  const defaultProps = {
    height: 400,
    width: 600,
    echartOptions: {},
  };

  test('renders without crashing', () => {
    const { container } = render(<EchartsMixedTimeseries {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  test('renders Echart component with correct props', () => {
    const { getByTestId } = render(<EchartsMixedTimeseries {...defaultProps} />);
    const echart = getByTestId('echart'); // Ensure Echart component has a data-testid="echart"
    
    expect(echart).toBeInTheDocument();
    expect(echart).toHaveAttribute('height', defaultProps.height.toString());
    expect(echart).toHaveAttribute('width', defaultProps.width.toString());
    // Check other props if necessary
  });
});
