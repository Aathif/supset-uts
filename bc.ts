import throttle from 'lodash/throttle';
import handleHover from './handleHover';
import getDropPosition from 'src/dashboard/util/getDropPosition';
import handleScroll from './handleScroll';
import { DASHBOARD_ROOT_TYPE } from 'src/dashboard/util/componentTypes';

jest.mock('lodash/throttle', () => jest.fn(fn => fn));
jest.mock('src/dashboard/util/getDropPosition', () => jest.fn());
jest.mock('./handleScroll', () => jest.fn());

describe('handleHover', () => {
  let monitor, Component, props;

  beforeEach(() => {
    monitor = {};

    Component = {
      mounted: true,
      setState: jest.fn(),
      props: {
        component: {
          type: 'NON_ROOT_TYPE',
        },
        onHover: jest.fn(),
      },
    };

    props = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing if the component is not mounted', () => {
    Component.mounted = false;
    handleHover(props, monitor, Component);
    expect(Component.setState).not.toHaveBeenCalled();
    expect(getDropPosition).not.toHaveBeenCalled();
  });

  it('should set dropIndicator to null if dropPosition is invalid', () => {
    getDropPosition.mockReturnValue(null);
    handleHover(props, monitor, Component);
    expect(Component.setState).toHaveBeenCalledWith({ dropIndicator: null });
    expect(handleScroll).not.toHaveBeenCalled();
  });

  it('should handle hover when dropPosition is valid', () => {
    const dropPosition = 'valid-position';
    getDropPosition.mockReturnValue(dropPosition);

    handleHover(props, monitor, Component);

    expect(getDropPosition).toHaveBeenCalledWith(monitor, Component);
    expect(Component.setState).toHaveBeenCalledWith({
      dropIndicator: dropPosition,
    });
    expect(Component.props.onHover).toHaveBeenCalled();
  });

  it('should handle scroll when the component is dashboard root', () => {
    const dropPosition = 'valid-position';
    getDropPosition.mockReturnValue(dropPosition);
    Component.props.component.type = DASHBOARD_ROOT_TYPE;

    handleHover(props, monitor, Component);

    expect(handleScroll).toHaveBeenCalledWith('SCROLL_TOP');
    expect(Component.setState).toHaveBeenCalledWith({
      dropIndicator: dropPosition,
    });
  });

  it('should not handle scroll when the component is not dashboard root', () => {
    const dropPosition = 'valid-position';
    getDropPosition.mockReturnValue(dropPosition);

    handleHover(props, monitor, Component);

    expect(handleScroll).not.toHaveBeenCalled();
    expect(Component.setState).toHaveBeenCalledWith({
      dropIndicator: dropPosition,
    });
  });

  it('should throttle the hover handler', () => {
    expect(throttle).toHaveBeenCalledWith(expect.any(Function), 100);
  });
});
