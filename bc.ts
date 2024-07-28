import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BucketKPI from './BucketKPI';

const mockStore = configureStore([]);

describe('BucketKPI Component', () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      sliceEntities: {
        slices: {
          1: { slice_name: 'Test Slice' }
        }
      }
    };
    store = mockStore(initialState);
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <BucketKPI data={{}} chartProps={{ rawFormData: {} }} />
      </Provider>
    );
    // Add assertions to check if the component renders correctly
  });

  test('displays "No data found" when no data is provided', () => {
    render(
      <Provider store={store}>
        <BucketKPI data={{}} chartProps={{ rawFormData: {} }} />
      </Provider>
    );
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  test('processes and displays data correctly', () => {
    const mockData = {
      values: [{ metric1: 100, metric2: 200 }],
      percentMetric: {}
    };
    render(
      <Provider store={store}>
        <BucketKPI data={mockData} chartProps={{ rawFormData: {} }} />
      </Provider>
    );
    // Add assertions to check if the data is displayed correctly
  });

  test('toggles between horizontal and vertical visualization', () => {
    render(
      <Provider store={store}>
        <BucketKPI data={{}} chartProps={{ rawFormData: {} }} transposePivot={false} />
      </Provider>
    );
    // Check initial horizontal visualization
    // Then update props and check vertical visualization
  });

  test('updates target value when edit button is clicked', () => {
    render(
      <Provider store={store}>
        <BucketKPI 
          data={{}} 
          chartProps={{ rawFormData: {} }} 
          bucketkpivalue={100}
          bucketkpilabel="Target"
        />
      </Provider>
    );
    // Find and click edit button
    // Check if popover appears
    // Enter new value and submit
    // Check if state is updated and new value is displayed
  });

  test('sorts data when sort icon is clicked', () => {
    render(
      <Provider store={store}>
        <BucketKPI 
          data={{}} 
          chartProps={{ rawFormData: {} }} 
          showSortIcons={true}
        />
      </Provider>
    );
    // Find and click sort icon
    // Check if sortLabel method is called
    // Check if data is re-rendered in sorted order
  });
});
