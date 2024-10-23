import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { ensureIsArray, getChartMetadataRegistry, t } from '@superset-ui/core';
import { useResultsPane } from './useResultsPane'; // Assuming the file is named useResultsPane.tsx
import { getChartDataRequest } from 'src/components/Chart/chartAction';
import { getClientErrorObject } from 'src/utils/getClientErrorObject';
import Loading from 'src/components/Loading';
import { EmptyStateMedium } from 'src/components/EmptyState';
import { SingleQueryResultPane } from './SingleQueryResultPane';

// Mock dependencies
jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  ensureIsArray: jest.fn(arr => Array.isArray(arr) ? arr : [arr]),
  getChartMetadataRegistry: () => ({
    get: jest.fn(() => ({ queryObjectCount: 1 })),
  }),
  t: jest.fn((str) => str),
}));
jest.mock('src/components/Chart/chartAction', () => ({
  getChartDataRequest: jest.fn(),
}));
jest.mock('src/utils/getClientErrorObject', () => ({
  getClientErrorObject: jest.fn(),
}));
jest.mock('src/components/Loading', () => jest.fn(() => <div>Loading...</div>));
jest.mock('src/components/EmptyState', () => ({
  EmptyStateMedium: jest.fn(({ title }) => <div>{title}</div>),
}));
jest.mock('./SingleQueryResultPane', () => ({
  SingleQueryResultPane: jest.fn(() => <div>SingleQueryResultPane</div>),
}));

describe('useResultsPane', () => {
  const defaultProps = {
    isRequest: true,
    queryFormData: { viz_type: 'table', datasource: '1234' },
    queryForce: false,
    ownState: {},
    errorMessage: '',
    actions: { setForceQuery: jest.fn() },
    isVisible: true,
    dataSize: 50,
  };

  it('should display Loading component when data is being fetched', async () => {
    getChartDataRequest.mockResolvedValue({ json: { result: [] } });
    
    const { result, waitForNextUpdate } = renderHook(() =>
      useResultsPane(defaultProps),
    );
    
    // Initially, it should render the Loading component
    expect(result.current[0].type).toBe(Loading);
    
    await act(async () => {
      await waitForNextUpdate(); // Wait for hook to finish updating
    });

    // Loading should disappear after data is loaded
    expect(result.current[0].type).not.toBe(Loading);
  });

  it('should render error state if an error occurs', async () => {
    const mockError = 'Network error';
    getClientErrorObject.mockResolvedValue({ error: mockError });
    getChartDataRequest.mockRejectedValue(new Error(mockError));

    const { result, waitForNextUpdate } = renderHook(() =>
      useResultsPane(defaultProps),
    );

    await act(async () => {
      await waitForNextUpdate(); // Wait for hook to finish updating
    });

    expect(result.current[0].props.children).toContain(mockError); // Error message
  });

  it('should render EmptyState if no data is returned', async () => {
    getChartDataRequest.mockResolvedValue({ json: { result: [] } });

    const { result, waitForNextUpdate } = renderHook(() =>
      useResultsPane(defaultProps),
    );

    await act(async () => {
      await waitForNextUpdate(); // Wait for hook to finish updating
    });

    expect(result.current[0].type).toBe(EmptyStateMedium);
    expect(result.current[0].props.title).toBe('No results were returned for this query');
  });

  it('should render SingleQueryResultPane when data is available', async () => {
    const mockData = {
      result: [{
        data: [['John Doe', 35], ['Jane Doe', 28]],
        colnames: ['name', 'age'],
        coltypes: ['string', 'int'],
        rowcount: 2,
      }],
    };
    getChartDataRequest.mockResolvedValue({ json: mockData });

    const { result, waitForNextUpdate } = renderHook(() =>
      useResultsPane(defaultProps),
    );

    await act(async () => {
      await waitForNextUpdate(); // Wait for hook to finish updating
    });

    expect(SingleQueryResultPane).toHaveBeenCalled();
    expect(result.current.length).toBe(1);
    expect(result.current[0].props.data).toEqual(mockData.result[0].data);
    expect(result.current[0].props.colnames).toEqual(mockData.result[0].colnames);
  });

  it('should use cached data if available', async () => {
    const cachedResult = {
      data: [['John Doe', 35]],
      colnames: ['name', 'age'],
      coltypes: ['string', 'int'],
      rowcount: 1,
    };
    const cache = new WeakMap();
    cache.set(defaultProps.queryFormData, [cachedResult]);

    const { result } = renderHook(() =>
      useResultsPane({ ...defaultProps, isRequest: true }),
    );

    // Since cache is set, it should use the cached data
    expect(result.current[0].type).toBe(SingleQueryResultPane);
  });
});
