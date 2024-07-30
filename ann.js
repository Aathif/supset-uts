import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EchartsSunburst, { extractTreePathInfo } from './EchartsSunburst';
import { SunburstTransformedProps } from './types';
import { BinaryQueryObjectFilterClause } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  getColumnLabel: jest.fn().mockImplementation(col => col),
  getNumberFormatter: jest.fn().mockImplementation(() => (value: number) => `${value}`),
  getTimeFormatter: jest.fn().mockImplementation(() => (value: number) => `${value}`),
  formatSeriesName: jest.fn().mockImplementation((name, opts) => name),
}));

jest.mock('../components/Echart', () => jest.fn().mockImplementation(({ eventHandlers }) => {
  const { click, contextmenu } = eventHandlers;
  return (
    <div>
      <button onClick={() => click({ treePathInfo: [{ name: 'path1' }] })}>Click Event</button>
      <button onContextMenu={(e) => {
        e.preventDefault();
        contextmenu({
          event: { event: e, stop: jest.fn() },
          treePathInfo: [{ name: 'path1' }],
          data: { records: ['record1'] },
        });
      }}>Context Menu Event</button>
    </div>
  );
}));

describe('EchartsSunburst', () => {
  const defaultProps: SunburstTransformedProps = {
    height: 600,
    width: 800,
    echartOptions: {},
    setDataMask: jest.fn(),
    labelMap: { path1: ['path1'] },
    selectedValues: ['path1'],
    formData: {
      columns: ['col1'],
      dateFormat: 'YYYY-MM-DD',
      numberFormat: '.2f',
    },
    onContextMenu: jest.fn(),
    refs: {},
    emitCrossFilters: true,
    coltypeMapping: { col1: 'string' },
  };

  it('should render correctly', () => {
    const { getByText } = render(<EchartsSunburst {...defaultProps} />);
    expect(getByText('Click Event')).toBeInTheDocument();
    expect(getByText('Context Menu Event')).toBeInTheDocument();
  });

  it('should handle click event', () => {
    const { getByText } = render(<EchartsSunburst {...defaultProps} />);
    fireEvent.click(getByText('Click Event'));

    expect(defaultProps.setDataMask).toHaveBeenCalledWith({
      extraFormData: {
        filters: [{
          col: 'col1',
          op: 'IN',
          val: ['path1'],
        }],
      },
      filterState: {
        value: [['path1']],
        selectedValues: ['path1'],
      },
    });
  });

  it('should handle context menu event', () => {
    const { getByText } = render(<EchartsSunburst {...defaultProps} />);
    fireEvent.contextMenu(getByText('Context Menu Event'));

    expect(defaultProps.onContextMenu).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      {
        drillToDetail: [{
          col: 'col1',
          op: '==',
          val: 'record1',
          formattedVal: 'path1',
        }],
        crossFilter: {
          dataMask: {
            extraFormData: {
              filters: [{
                col: 'col1',
                op: 'IN',
                val: ['path1'],
              }],
            },
            filterState: {
              value: [['path1']],
              selectedValues: ['path1'],
            },
          },
          isCurrentValueSelected: true,
        },
        drillBy: {
          filters: [{
            col: 'col1',
            op: '==',
            val: 'path1',
            formattedVal: 'path1',
          }],
          groupbyFieldName: 'columns',
        },
      },
    );
  });

  it('extractTreePathInfo should handle undefined and empty array', () => {
    expect(extractTreePathInfo(undefined)).toEqual([]);
    expect(extractTreePathInfo([])).toEqual([]);
    expect(extractTreePathInfo([{ name: 'path1' }, { name: 'path2' }])).toEqual(['path1', 'path2']);
  });
});
