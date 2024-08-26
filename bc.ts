import React from 'react';
import { render } from '@testing-library/react';
import EventFlow from './EventFlow';
import { App as EventFlowApp } from '@data-ui/event-flow';
import { t } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  t: jest.fn((str) => str),
}));

jest.mock('@data-ui/event-flow', () => ({
  App: jest.fn(() => <div>MockEventFlowApp</div>),
}));

describe('EventFlow', () => {
  const defaultProps = {
    data: [
      { entity: 'user1', event_name: 'login', __timestamp: 1622548800000 },
    ],
    initialMinEventCount: 5,
    height: 600,
    width: 800,
  };

  it('should render EventFlowApp when data is available', () => {
    const { getByText } = render(<EventFlow {...defaultProps} />);

    expect(EventFlowApp).toHaveBeenCalledWith(
      {
        width: 800,
        height: 600,
        data: defaultProps.data,
        initialMinEventCount: 5,
        initialShowControls: false,
      },
      {}
    );

    // Ensure the mocked EventFlowApp is rendered
    expect(getByText('MockEventFlowApp')).toBeInTheDocument();
  });

  it('should display a message when no data is available', () => {
    const { getByText } = render(
      <EventFlow
        data={[]}
        initialMinEventCount={5}
        height={600}
        width={800}
      />
    );

    expect(getByText('Sorry, there appears to be no data')).toBeInTheDocument();
  });

  it('should use default height and width if not provided', () => {
    const { getByText } = render(
      <EventFlow
        data={defaultProps.data}
        initialMinEventCount={defaultProps.initialMinEventCount}
      />
    );

    expect(EventFlowApp).toHaveBeenCalledWith(
      {
        width: 400, // default width
        height: 400, // default height
        data: defaultProps.data,
        initialMinEventCount: 5,
        initialShowControls: false,
      },
      {}
    );

    // Ensure the mocked EventFlowApp is rendered
    expect(getByText('MockEventFlowApp')).toBeInTheDocument();
  });
});
