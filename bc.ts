import { applyNativeColumns } from './path_to_your_function'; // Update with actual path

// Mocked constants
const ANNOTATION_SOURCE_TYPES = {
  NATIVE: 'NATIVE',
  EXTERNAL: 'EXTERNAL', // for non-native test case
};

const NATIVE_COLUMN_NAMES = {
  nativeColumn1: 'value1',
  nativeColumn2: 'value2',
};

describe('applyNativeColumns', () => {
  it('should apply NATIVE_COLUMN_NAMES when sourceType is NATIVE', () => {
    const annotation = {
      sourceType: ANNOTATION_SOURCE_TYPES.NATIVE,
      someOtherProperty: 'otherValue',
    };
    const result = applyNativeColumns(annotation);
    expect(result).toEqual({
      sourceType: ANNOTATION_SOURCE_TYPES.NATIVE,
      someOtherProperty: 'otherValue',
      nativeColumn1: 'value1',
      nativeColumn2: 'value2',
    });
  });

  it('should not modify the annotation when sourceType is not NATIVE', () => {
    const annotation = {
      sourceType: ANNOTATION_SOURCE_TYPES.EXTERNAL,
      someOtherProperty: 'otherValue',
    };
    const result = applyNativeColumns(annotation);
    expect(result).toEqual(annotation); // should return the same object
  });

  it('should return the original object when no sourceType is provided', () => {
    const annotation = {
      someOtherProperty: 'otherValue',
    };
    const result = applyNativeColumns(annotation);
    expect(result).toEqual(annotation);
  });
});
