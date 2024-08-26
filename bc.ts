import { ColumnMeta, isColumnMeta } from '@superset-ui/chart-controls';
import { AdhocColumn, QueryFormColumn, isPhysicalColumn } from '@superset-ui/core';
import { OptionSelector } from './OptionSelector'; // adjust import as needed

describe('OptionSelector', () => {
  const column1: ColumnMeta = { column_name: 'col1' } as ColumnMeta;
  const column2: ColumnMeta = { column_name: 'col2' } as ColumnMeta;
  const adhocColumn1: AdhocColumn = { label: 'adhoc1' } as AdhocColumn;

  const options = {
    col1: column1,
    col2: column2,
  };

  describe('constructor', () => {
    it('should initialize with empty values when initialValues is undefined', () => {
      const selector = new OptionSelector(options, true);
      expect(selector.values).toEqual([]);
    });

    it('should initialize with provided initialValues', () => {
      const selector = new OptionSelector(options, true, ['col1']);
      expect(selector.values).toEqual([column1]);
    });

    it('should handle adhoc columns in initialValues', () => {
      const selector = new OptionSelector(options, true, [adhocColumn1]);
      expect(selector.values).toEqual([adhocColumn1]);
    });
  });

  describe('add', () => {
    it('should add physical column if it exists in options', () => {
      const selector = new OptionSelector(options, true);
      selector.add('col1');
      expect(selector.values).toEqual([column1]);
    });

    it('should add adhoc column directly', () => {
      const selector = new OptionSelector(options, true);
      selector.add(adhocColumn1);
      expect(selector.values).toEqual([adhocColumn1]);
    });
  });

  describe('del', () => {
    it('should delete a value by index', () => {
      const selector = new OptionSelector(options, true, ['col1', 'col2']);
      selector.del(0);
      expect(selector.values).toEqual([column2]);
    });
  });

  describe('replace', () => {
    it('should replace a value at a given index', () => {
      const selector = new OptionSelector(options, true, ['col1']);
      selector.replace(0, 'col2');
      expect(selector.values).toEqual([column2]);
    });
  });

  describe('swap', () => {
    it('should swap two values by their indices', () => {
      const selector = new OptionSelector(options, true, ['col1', 'col2']);
      selector.swap(0, 1);
      expect(selector.values).toEqual([column2, column1]);
    });
  });

  describe('has', () => {
    it('should return true if the value exists in values', () => {
      const selector = new OptionSelector(options, true, ['col1']);
      expect(selector.has('col1')).toBe(true);
    });

    it('should return false if the value does not exist in values', () => {
      const selector = new OptionSelector(options, true, ['col1']);
      expect(selector.has('col2')).toBe(false);
    });
  });

  describe('getValues', () => {
    it('should return the first value if multi is false', () => {
      const selector = new OptionSelector(options, false, ['col1']);
      expect(selector.getValues()).toBe('col1');
    });

    it('should return an array of values if multi is true', () => {
      const selector = new OptionSelector(options, true, ['col1', 'col2']);
      expect(selector.getValues()).toEqual(['col1', 'col2']);
    });

    it('should return undefined if no values exist and multi is false', () => {
      const selector = new OptionSelector(options, false);
      expect(selector.getValues()).toBeUndefined();
    });
  });
});
