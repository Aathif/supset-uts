import { safeStringify } from './safeStringify';

describe('safeStringify', () => {
  test('should stringify a normal JSON object', () => {
    const obj = { a: 1, b: 'test', c: true };
    const result = safeStringify(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  test('should handle null values correctly', () => {
    const obj = { a: null };
    const result = safeStringify(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  test('should handle empty objects', () => {
    const obj = {};
    const result = safeStringify(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  test('should omit circular references', () => {
    const obj: any = { a: 1 };
    obj.b = obj; // Circular reference
    const result = safeStringify(obj);
    expect(result).toBe(JSON.stringify({ a: 1 }));
  });

  test('should handle deep nested circular references', () => {
    const obj: any = { a: { b: { c: {} } } };
    obj.a.b.c = obj.a; // Circular reference deep inside the object
    const result = safeStringify(obj);
    expect(result).toBe(JSON.stringify({ a: { b: { c: {} } } }));
  });

  test('should stringify arrays with circular references omitted', () => {
    const arr: any = [1, 2];
    arr.push(arr); // Circular reference
    const result = safeStringify(arr);
    expect(result).toBe(JSON.stringify([1, 2]));
  });

  test('should handle deep copies of repeated objects', () => {
    const obj = { a: 1 };
    const obj2 = { b: obj, c: obj }; // Repeated but not circular
    const result = safeStringify(obj2);
    expect(result).toBe(JSON.stringify(obj2)); // Should stringify normally as there's no circular ref
  });

  test('should handle non-object types like string or number', () => {
    const str = "test string";
    const num = 123;
    expect(safeStringify(str)).toBe(JSON.stringify(str));
    expect(safeStringify(num)).toBe(JSON.stringify(num));
  });

  test('should return undefined when unable to parse value in case of deep copy failure', () => {
    const obj: any = { a: {} };
    obj.a.self = obj.a; // Self-referential circular object
    const result = safeStringify(obj);
    expect(result).toBe(JSON.stringify({ a: {} }));
  });
});
