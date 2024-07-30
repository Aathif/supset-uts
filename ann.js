import needScrollBar from './needScrollBar';

describe('needScrollBar', () => {
  it('should not need any scroll bars when inner dimensions are within outer dimensions', () => {
    const result = needScrollBar({
      width: 100,
      height: 100,
      innerHeight: 50,
      innerWidth: 50,
      scrollBarSize: 15,
    });
    expect(result).toEqual([false, false]);
  });

  it('should need vertical scroll bar when innerHeight is greater than height', () => {
    const result = needScrollBar({
      width: 100,
      height: 50,
      innerHeight: 100,
      innerWidth: 50,
      scrollBarSize: 15,
    });
    expect(result).toEqual([true, false]);
  });

  it('should need horizontal scroll bar when innerWidth is greater than width', () => {
    const result = needScrollBar({
      width: 50,
      height: 100,
      innerHeight: 50,
      innerWidth: 100,
      scrollBarSize: 15,
    });
    expect(result).toEqual([false, true]);
  });

  it('should need both scroll bars when inner dimensions exceed outer dimensions', () => {
    const result = needScrollBar({
      width: 50,
      height: 50,
      innerHeight: 100,
      innerWidth: 100,
      scrollBarSize: 15,
    });
    expect(result).toEqual([true, true]);
  });

  it('should account for the scroll bar size when determining horizontal scroll bar', () => {
    const result = needScrollBar({
      width: 100,
      height: 50,
      innerHeight: 100,
      innerWidth: 90,
      scrollBarSize: 15,
    });
    expect(result).toEqual([true, true]);
  });

  it('should not need horizontal scroll bar if width is enough even after accounting for vertical scroll bar', () => {
    const result = needScrollBar({
      width: 100,
      height: 50,
      innerHeight: 100,
      innerWidth: 85,
      scrollBarSize: 15,
    });
    expect(result).toEqual([true, false]);
  });

  it('should need horizontal scroll bar if innerWidth exceeds width adjusted for vertical scroll bar', () => {
    const result = needScrollBar({
      width: 100,
      height: 50,
      innerHeight: 100,
      innerWidth: 86,
      scrollBarSize: 15,
    });
    expect(result).toEqual([true, true]);
  });
});
