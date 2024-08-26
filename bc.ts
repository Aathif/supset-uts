import transformProps from './transformProps';
import { cleanEvents, TS, EVENT_NAME, ENTITY_ID } from '@data-ui/event-flow';

jest.mock('@data-ui/event-flow', () => ({
  cleanEvents: jest.fn(),
  TS: 'timestamp',
  EVENT_NAME: 'eventName',
  ENTITY_ID: 'entityId',
}));

describe('transformProps', () => {
  const mockChartProps = {
    formData: {
      allColumnsX: 'event_name',
      entity: 'user_id',
      minLeafNodeEventCount: 5,
    },
    queriesData: [
      {
        data: [
          { user_id: 'user1', event_name: 'login', __timestamp: 1622548800000 },
          { user_id: 'user2', event_name: 'logout', __timestamp: 1622635200000 },
        ],
      },
    ],
    width: 800,
    height: 600,
  };

  beforeEach(() => {
    cleanEvents.mockClear();
  });

  it('should transform props correctly when data is available', () => {
    const result = transformProps(mockChartProps);

    expect(cleanEvents).toHaveBeenCalledWith(mockChartProps.queriesData[0].data, {
      [ENTITY_ID]: expect.any(Function),
      [EVENT_NAME]: expect.any(Function),
      [TS]: expect.any(Function),
    });

    expect(result).toEqual({
      data: expect.anything(),
      height: 600,
      initialMinEventCount: 5,
      width: 800,
    });

    // Validate the accessor functions
    const accessors = cleanEvents.mock.calls[0][1];
    const sampleData = mockChartProps.queriesData[0].data[0];
    expect(accessors[ENTITY_ID](sampleData)).toBe('user1');
    expect(accessors[EVENT_NAME](sampleData)).toBe('login');
    expect(accessors[TS](sampleData)).toEqual(new Date(1622548800000));
  });

  it('should return default props when no data is available', () => {
    const noDataProps = {
      ...mockChartProps,
      queriesData: [{ data: [] }],
    };
    const result = transformProps(noDataProps);

    expect(result).toEqual({
      data: null,
      height: 600,
      width: 800,
    });
    expect(cleanEvents).not.toHaveBeenCalled();
  });
});
