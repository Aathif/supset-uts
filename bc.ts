import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EchartsTimeseries from './EchartsTimeseries';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../components/Echart', () => ({ height, width, echartOptions, eventHandlers, selectedValues }) => (
  <div>
    <div data-testid="echart" style={{ height, width }}>
      {JSON.stringify(echartOptions)}
    </div>
    <button data-testid="click-handler" onClick={() => eventHandlers.click({ seriesName: 'series1' })}>Click</button>
  </div>
));

describe('EchartsTimeseries', () => {
  const mockSetDataMask = jest.fn();
  const formData = {
    orderByColumn: 'value',
    orderDesc: true,
    emitFilter: true,
  };
  const echartOptions = {
    series: [
      {
        data: [[1, 10], [2, 20], [3, 15]],
      },
    ],
  };
  const groupby = ['col1'];
  const labelMap = { series1: ['label1'] };
  const selectedValues = ['series1'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByTestId } = render(
      <EchartsTimeseries
        formData={formData}
        height={400}
        width={800}
        echartOptions={echartOptions}
        groupby={groupby}
        labelMap={labelMap}
        selectedValues={selectedValues}
        setDataMask={mockSetDataMask}
      />
    );
    expect(getByTestId('echart')).toBeInTheDocument();
  });

  it('should sort the series data based on formData.orderByColumn and formData.orderDesc', () => {
    render(
      <EchartsTimeseries
        formData={formData}
        height={400}
        width={800}
        echartOptions={echartOptions}
        groupby={groupby}
        labelMap={labelMap}
        selectedValues={selectedValues}
        setDataMask={mockSetDataMask}
      />
    );

    // The data should be sorted by the second column (value) in descending order
    expect(echartOptions.series[0].data).toEqual([[2, 20], [3, 15], [1, 10]]);
  });

  it('should handle click events and update selected values', () => {
    const { getByTestId } = render(
      <EchartsTimeseries
        formData={formData}
        height={400}
        width={800}
        echartOptions={echartOptions}
        groupby={groupby}
        labelMap={labelMap}
        selectedValues={selectedValues}
        setDataMask={mockSetDataMask}
      />
    );

    fireEvent.click(getByTestId('click-handler'));

    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: {
        filters: [{ col: 'col1', op: 'IN', val: ['label1'] }],
      },
      filterState: {
        label: [['label1']],
        value: [['label1']],
        selectedValues: ['series1'],
      },
    });
  });

  it('should handle click events and remove selected values if already selected', () => {
    const newSelectedValues = ['series1', 'series2'];
    const { getByTestId } = render(
      <EchartsTimeseries
        formData={formData}
        height={400}
        width={800}
        echartOptions={echartOptions}
        groupby={groupby}
        labelMap={labelMap}
        selectedValues={newSelectedValues}
        setDataMask={mockSetDataMask}
      />
    );

    fireEvent.click(getByTestId('click-handler'));

    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: {
        filters: [{ col: 'col1', op: 'IN', val: ['label1'] }],
      },
      filterState: {
        label: [['label1']],
        value: [['label1']],
        selectedValues: ['series2'],
      },
    });
  });
});
