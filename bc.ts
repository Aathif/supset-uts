import { DataRecord } from '@superset-ui/core';
import { calculateDifferences, processDataRecords } from './transformProps';

describe('transformProps utility functions', () => {

  describe('calculateDifferences', () => {
    it('should calculate the correct value and percent differences', () => {
      expect(calculateDifferences(100, 50)).toEqual({
        valueDifference: 50,
        percentDifferenceNum: 1,
      });

      expect(calculateDifferences(50, 100)).toEqual({
        valueDifference: -50,
        percentDifferenceNum: -0.5,
      });

      expect(calculateDifferences(0, 0)).toEqual({
        valueDifference: 0,
        percentDifferenceNum: 0,
      });

      expect(calculateDifferences(100, 0)).toEqual({
        valueDifference: 100,
        percentDifferenceNum: 1,
      });
    });
  });

  describe('processDataRecords', () => {
    it('should return the original data if no Temporal columns are found', () => {
      const data: DataRecord[] = [
        { col1: 'value1', col2: 123 },
        { col1: 'value2', col2: 456 },
      ];
      const columns = [{ key: 'col1', dataType: 'STRING' }, { key: 'col2', dataType: 'NUMERIC' }];
      expect(processDataRecords(data, columns)).toEqual(data);
    });

    it('should convert Temporal columns to DateWithFormatter instances', () => {
      const data: DataRecord[] = [
        { col1: '2023-01-01T00:00:00Z', col2: 123 },
        { col1: '2023-01-02T00:00:00Z', col2: 456 },
      ];
      const columns = [{ key: 'col1', dataType: 'TEMPORAL', formatter: (d: Date) => d.toISOString() }];
      const processedData = processDataRecords(data, columns);

      expect(processedData[0].col1.getTime()).toEqual(new Date('2023-01-01T00:00:00Z').getTime());
      expect(processedData[1].col1.getTime()).toEqual(new Date('2023-01-02T00:00:00Z').getTime());
    });
  });

});
