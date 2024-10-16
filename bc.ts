import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSlices, updateSlices } from '../actions/sliceEntities';
import SliceAdder from '../components/SliceAdder';
import ConnectedSliceAdder, { mapStateToProps, mapDispatchToProps } from './SliceAdder';

const mockStore = configureStore([]);

jest.mock('../actions/sliceEntities', () => ({
  fetchSlices: jest.fn(),
  updateSlices: jest.fn(),
}));

describe('ConnectedSliceAdder', () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      sliceEntities: {
        slices: [],
        isLoading: false,
        errorMessage: null,
        lastUpdated: null,
      },
      dashboardInfo: {
        userId: 1,
        id: 100,
      },
      dashboardState: {
        sliceIds: [1, 2],
        editMode: true,
      },
    };
    store = mockStore(initialState);
  });

  it('renders SliceAdder component with the correct props from Redux', () => {
    render(
      <Provider store={store}>
        <ConnectedSliceAdder height={400} />
      </Provider>,
    );

    expect(screen.getByText('Add Slice')).toBeInTheDocument(); // Assuming "Add Slice" is rendered in SliceAdder
  });

  it('mapStateToProps returns the correct props', () => {
    const ownProps = { height: 400 };
    const stateProps = mapStateToProps(initialState, ownProps);

    expect(stateProps).toEqual({
      height: 400,
      userId: 1,
      dashboardId: 100,
      selectedSliceIds: [1, 2],
      slices: [],
      isLoading: false,
      errorMessage: null,
      lastUpdated: null,
      editMode: true,
    });
  });

  it('mapDispatchToProps returns the correct actions', () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.fetchSlices();
    expect(fetchSlices).toHaveBeenCalled();

    props.updateSlices();
    expect(updateSlices).toHaveBeenCalled();
  });

  it('dispatches fetchSlices action when the component is rendered', async () => {
    render(
      <Provider store={store}>
        <ConnectedSliceAdder height={400} />
      </Provider>,
    );

    await waitFor(() => {
      expect(fetchSlices).toHaveBeenCalled();
    });
  });
});
