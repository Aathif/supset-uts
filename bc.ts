import React from 'react';
import { render } from '@testing-library/react';
import EchartMultipleYAxis from './EchartMultipleYAxis';
import Echart from '../components/Echart';

jest.mock('../components/Echart', () => jest.fn(() => <div>Echart Component</div>));

describe('EchartMultipleYAxis', () => {
  const mockEchartOptions = {
    series: [
      { data: [[1, 2], [3, 4], [2, 3]] },
      { data: [[1, 5], [3, 6], [2, 7]] },
    ],
  };
  
  const mockFormData = {
    orderByColumn: 'axis',
    orderDesc: true,
  };

  it('renders without crashing', () => {
    const { container } = render(
      <EchartMultipleYAxis
        height={400}
        width={800}
        echartOptions={mockEchartOptions}
        formData={mockFormData}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('sorts series data correctly when orderDesc is true', () => {
    const sortedData = [[3, 4], [2, 3], [1, 2]];
    
    render(
      <EchartMultipleYAxis
        height={400}
        width={800}
        echartOptions={mockEchartOptions}
        formData={{ ...mockFormData, orderDesc: true }}
      />
    );

    expect(mockEchartOptions.series[0].data).toEqual(sortedData);
  });

  it('sorts series data correctly when orderDesc is false', () => {
    const sortedData = [[1, 2], [2, 3], [3, 4]];
    
    render(
      <EchartMultipleYAxis
        height={400}
        width={800}
        echartOptions={mockEchartOptions}
        formData={{ ...mockFormData, orderDesc: false }}
      />
    );

    expect(mockEchartOptions.series[0].data).toEqual(sortedData);
  });

  it('passes the correct props to the Echart component', () => {
    const { height, width } = { height: 400, width: 800 };

    render(
      <EchartMultipleYAxis
        height={height}
        width={width}
        echartOptions={mockEchartOptions}
        formData={mockFormData}
      />
    );

    expect(Echart).toHaveBeenCalledWith(
      expect.objectContaining({
        height,
        width,
        echartOptions: mockEchartOptions,
      }),
      {}
    );
  });
});
