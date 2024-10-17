import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, fireEvent, screen } from '@testing-library/react';
import AnnotationLayerControl from './AnnotationLayerControl';
import { runAnnotationQuery } from 'src/components/Chart/chartAction';

jest.mock('src/components/Chart/chartAction', () => ({
  runAnnotationQuery: jest.fn(),
}));

const mockStore = configureStore([]);

describe('AnnotationLayerControl', () => {
  let store;
  const initialState = {
    charts: {
      someChartKey: {
        annotationError: {},
        annotationQuery: {},
      },
    },
    explore: {
      controls: {
        color_scheme: { value: 'some_color_scheme' },
        viz_type: { value: 'line' },
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders the component', () => {
    const { container } = render(
      <Provider store={store}>
        <AnnotationLayerControl value={[]} onChange={jest.fn()} actions={{}} />
      </Provider>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Add annotation layer')).toBeInTheDocument();
  });

  it('opens the popover when Add annotation layer button is clicked', () => {
    render(
      <Provider store={store}>
        <AnnotationLayerControl value={[]} onChange={jest.fn()} actions={{}} />
      </Provider>
    );

    const addButton = screen.getByTestId('add-annotation-layer-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('calls onChange when adding a new annotation layer', () => {
    const mockOnChange = jest.fn();
    render(
      <Provider store={store}>
        <AnnotationLayerControl value={[]} onChange={mockOnChange} actions={{}} />
      </Provider>
    );

    const addButton = screen.getByTestId('add-annotation-layer-button');
    fireEvent.click(addButton);

    // Simulate adding a new annotation
    const annotation = { name: 'New Annotation', sourceType: 'NATIVE' };
    const addAnnotationLayer = screen.getByTestId('popover-content');

    // Assume that the component calls onChange with the new annotation array
    fireEvent.click(addAnnotationLayer);

    expect(mockOnChange).toHaveBeenCalledWith([annotation]);
  });

  it('dispatches the runAnnotationQuery action when a new annotation is added', () => {
    const mockOnChange = jest.fn();
    render(
      <Provider store={store}>
        <AnnotationLayerControl value={[]} onChange={mockOnChange} actions={{}} />
      </Provider>
    );

    const addButton = screen.getByTestId('add-annotation-layer-button');
    fireEvent.click(addButton);

    const annotation = { name: 'New Annotation', sourceType: 'NATIVE' };
    
    // Simulate dispatching the query action
    fireEvent.click(screen.getByTestId('popover-content'));

    expect(runAnnotationQuery).toHaveBeenCalledWith({ annotation, force: true });
  });
});
