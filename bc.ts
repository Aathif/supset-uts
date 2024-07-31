import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EchartsBoxPlot from './EchartsBoxPlot';
import Echart from '../components/Echart';

jest.mock('../components/Echart', () => jest.fn(() => <div>Echart Component</div>));

describe('EchartsBoxPlot', () => {
  const mockSetDataMask = jest.fn();
  const mockFormData = {
    emitFilter: true,
  };

  const defaultProps = {
    height: 600,
    width: 800,
    echartOptions: {},
    setDataMask: mockSetDataMask,
    labelMap: {
      'label-1': ['value1'],
    },
    groupby: ['groupby1'],
    selectedValues: {},
    formData: mockFormData,
  };

  it('renders correctly', () => {
    const { getByText } = render(<EchartsBoxPlot {...defaultProps} />);
    expect(getByText('Echart Component')).toBeInTheDocument();
  });

  it('calls setDataMask with correct filters on click', () => {
    const { getByText } = render(<EchartsBoxPlot {...defaultProps} />);
    const echartComponent = getByText('Echart Component');

    // Simulate click event
    fireEvent.click(echartComponent);

    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: {
        filters: [{
          col: 'groupby1',
          op: 'IN',
          val: ['value1'],
        }],
      },
      filterState: {
        value: [['value1']],
      },
      ownState: {
        selectedValues: ['label-1'],
      },
    });
  });

  it('calls handleChange with correct values on click', () => {
    const { getByText } = render(<EchartsBoxPlot {...defaultProps} />);
    const echartComponent = getByText('Echart Component');

    // Simulate click event
    fireEvent.click(echartComponent);

    expect(mockSetDataMask).toHaveBeenCalledTimes(1);

    // Simulate another click to deselect
    fireEvent.click(echartComponent);

    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: {
        filters: [],
      },
      filterState: {
        value: null,
      },
      ownState: {
        selectedValues: null,
      },
    });
  });
});
