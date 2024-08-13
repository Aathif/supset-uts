import { setAxisShowMaxMin } from './setAxisShowMaxMin'; // Adjust path as necessary

describe('setAxisShowMaxMin', () => {
  it('should call axis.showMaxMin with showminmax when axis and showMaxMin are defined', () => {
    const mockShowMaxMin = jest.fn();
    const axis = { showMaxMin: mockShowMaxMin };
    const showminmax = true;

    setAxisShowMaxMin(axis, showminmax);

    expect(mockShowMaxMin).toHaveBeenCalledWith(showminmax);
  });

  it('should not call axis.showMaxMin when axis is undefined', () => {
    const mockShowMaxMin = jest.fn();
    const axis = undefined;
    const showminmax = true;

    setAxisShowMaxMin(axis, showminmax);

    expect(mockShowMaxMin).not.toHaveBeenCalled();
  });

  it('should not call axis.showMaxMin when axis.showMaxMin is undefined', () => {
    const mockShowMaxMin = jest.fn();
    const axis = {};
    const showminmax = true;

    setAxisShowMaxMin(axis, showminmax);

    expect(mockShowMaxMin).not.toHaveBeenCalled();
  });

  it('should not call axis.showMaxMin when showminmax is undefined', () => {
    const mockShowMaxMin = jest.fn();
    const axis = { showMaxMin: mockShowMaxMin };

    setAxisShowMaxMin(axis, undefined);

    expect(mockShowMaxMin).not.toHaveBeenCalled();
  });
});
