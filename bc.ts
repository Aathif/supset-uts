import handleDrop from './handleDrop';
import getDropPosition, {
  clearDropCache,
  DROP_FORBIDDEN,
} from '../../util/getDropPosition';

jest.mock('../../util/getDropPosition', () => ({
  __esModule: true,
  default: jest.fn(),
  clearDropCache: jest.fn(),
  DROP_FORBIDDEN: 'DROP_FORBIDDEN',
}));

describe('handleDrop', () => {
  let monitor, Component, props;

  beforeEach(() => {
    monitor = {
      getItem: jest.fn(),
    };

    Component = {
      mounted: true,
      setState: jest.fn(),
      props: {
        parentComponent: null,
        component: {
          id: 'component-1',
          type: 'COMPONENT_TYPE',
          children: [],
        },
        index: 0,
        onDrop: jest.fn(),
        dropToChild: false,
      },
    };

    props = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if the component is not mounted', () => {
    Component.mounted = false;
    const result = handleDrop(props, monitor, Component);
    expect(result).toBeUndefined();
    expect(Component.setState).not.toHaveBeenCalled();
  });

  it('should return undefined if dropPosition is DROP_FORBIDDEN', () => {
    getDropPosition.mockReturnValue(DROP_FORBIDDEN);
    const result = handleDrop(props, monitor, Component);
    expect(result).toBeUndefined();
    expect(Component.setState).toHaveBeenCalledWith({ dropIndicator: null });
  });

  it('should handle drop and append item as a child', () => {
    getDropPosition.mockReturnValue('VALID_POSITION');
    monitor.getItem.mockReturnValue({
      id: 'dragging-item',
      parentId: 'parent-id',
      parentType: 'PARENT_TYPE',
      index: 1,
      type: 'DRAGGABLE_TYPE',
      meta: {},
    });

    Component.props.dropToChild = true;

    const result = handleDrop(props, monitor, Component);

    expect(result).toEqual({
      source: {
        id: 'parent-id',
        type: 'PARENT_TYPE',
        index: 1,
      },
      dragging: {
        id: 'dragging-item',
        type: 'DRAGGABLE_TYPE',
        meta: {},
      },
      destination: {
        id: 'component-1',
        type: 'COMPONENT_TYPE',
        index: 0,
      },
    });
    expect(Component.setState).toHaveBeenCalledWith({ dropIndicator: null });
    expect(Component.props.onDrop).toHaveBeenCalledWith(result);
    expect(clearDropCache).toHaveBeenCalled();
  });

  it('should handle drop and set the destination index based on the parent component', () => {
    getDropPosition.mockReturnValue('VALID_POSITION');
    monitor.getItem.mockReturnValue({
      id: 'dragging-item',
      parentId: 'parent-id',
      parentType: 'PARENT_TYPE',
      index: 1,
      type: 'DRAGGABLE_TYPE',
      meta: {},
    });

    Component.props.parentComponent = {
      id: 'parent-component-id',
      type: 'PARENT_COMPONENT_TYPE',
    };
    Component.props.index = 2;

    const result = handleDrop(props, monitor, Component);

    expect(result).toEqual({
      source: {
        id: 'parent-id',
        type: 'PARENT_TYPE',
        index: 1,
      },
      dragging: {
        id: 'dragging-item',
        type: 'DRAGGABLE_TYPE',
        meta: {},
      },
      destination: {
        id: 'parent-component-id',
        type: 'PARENT_COMPONENT_TYPE',
        index: 2,
      },
    });
    expect(Component.setState).toHaveBeenCalledWith({ dropIndicator: null });
    expect(Component.props.onDrop).toHaveBeenCalledWith(result);
    expect(clearDropCache).toHaveBeenCalled();
  });

  it('should adjust the destination index when moving within the same parent and with a lower index', () => {
    getDropPosition.mockReturnValue('VALID_POSITION');
    monitor.getItem.mockReturnValue({
      id: 'dragging-item',
      parentId: 'parent-id',
      parentType: 'PARENT_TYPE',
      index: 1,
      type: 'DRAGGABLE_TYPE',
      meta: {},
    });

    Component.props.parentComponent = {
      id: 'parent-id',
      type: 'PARENT_COMPONENT_TYPE',
    };
    Component.props.index = 2;

    const result = handleDrop(props, monitor, Component);

    expect(result).toEqual({
      source: {
        id: 'parent-id',
        type: 'PARENT_TYPE',
        index: 1,
      },
      dragging: {
        id: 'dragging-item',
        type: 'DRAGGABLE_TYPE',
        meta: {},
      },
      destination: {
        id: 'parent-id',
        type: 'PARENT_COMPONENT_TYPE',
        index: 2,
      },
    });
    expect(Component.setState).toHaveBeenCalledWith({ dropIndicator: null });
    expect(Component.props.onDrop).toHaveBeenCalledWith(result);
    expect(clearDropCache).toHaveBeenCalled();
  });

  it('should return undefined if dropPosition is not valid', () => {
    getDropPosition.mockReturnValue(null);
    const result = handleDrop(props, monitor, Component);
    expect(result).toBeUndefined();
    expect(clearDropCache).not.toHaveBeenCalled();
    expect(Component.props.onDrop).not.toHaveBeenCalled();
  });
});
