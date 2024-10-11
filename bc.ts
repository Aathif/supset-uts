import { setAxisShowMaxMin } from './setAxisShowMaxMin';

describe('setAxisShowMaxMin', () => {
  let mockAxis: any;

  beforeEach(() => {
    mockAxis = {
      showMaxMin: jest.fn(),
    };
  });

  it('should call axis.showMaxMin with true when showminmax is true', () => {
    setAxisShowMaxMin(mockAxis, true);
    expect(mockAxis.showMaxMin).toHaveBeenCalledWith(true);
  });

  it('should call axis.showMaxMin with false when showminmax is false', () => {
    setAxisShowMaxMin(mockAxis, false);
    expect(mockAxis.showMaxMin).toHaveBeenCalledWith(false);
  });

  it('should not call axis.showMaxMin if showminmax is undefined', () => {
    setAxisShowMaxMin(mockAxis, undefined);
    expect(mockAxis.showMaxMin).not.toHaveBeenCalled();
  });

  it('should not call axis.showMaxMin if axis is null', () => {
    setAxisShowMaxMin(null, true);
    expect(mockAxis.showMaxMin).not.toHaveBeenCalled();
  });

  it('should not call axis.showMaxMin if axis.showMaxMin is undefined', () => {
    mockAxis.showMaxMin = undefined;
    setAxisShowMaxMin(mockAxis, true);
    expect(mockAxis.showMaxMin).toBeUndefined();
  });
});
