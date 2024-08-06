// utils.test.js
import {
  addSeparators,
  numberFormat,
  naturalSort,
  sortAs,
  aggregators,
} from './path/to/your/module';

describe('Utility Functions', () => {
  test('addSeparators should add commas as thousands separators', () => {
    expect(addSeparators('1234567', ',', '.')).toBe('1,234,567');
    expect(addSeparators('1234.567', ',', '.')).toBe('1,234.567');
  });

  test('numberFormat should format numbers correctly', () => {
    const fmt = numberFormat({ digitsAfterDecimal: 2, scaler: 1, thousandsSep: ',', decimalSep: '.' });
    expect(fmt(1234567.89)).toBe('1,234,567.89');
    expect(fmt(1234)).toBe('1,234.00');
  });

  test('naturalSort should sort numbers and strings correctly', () => {
    expect([10, 2, 'a', 'b'].sort(naturalSort)).toEqual([2, 10, 'a', 'b']);
    expect(['apple', 'banana', 'cherry'].sort(naturalSort)).toEqual(['apple', 'banana', 'cherry']);
  });

  test('sortAs should sort based on a custom order', () => {
    const order = ['b', 'a', 'c'];
    const customSort = sortAs(order);
    expect(['a', 'b', 'c'].sort(customSort)).toEqual(['b', 'a', 'c']);
  });
});

describe('Aggregators', () => {
  test('count aggregator should count records correctly', () => {
    const countAggregator = aggregators.count()();
    countAggregator.push({});
    countAggregator.push({});
    expect(countAggregator.value()).toBe(2);
  });

  test('sum aggregator should sum values correctly', () => {
    const sumAggregator = aggregators.sum(['value'])();
    sumAggregator.push({ value: 10 });
    sumAggregator.push({ value: 20 });
    expect(sumAggregator.value()).toBe(30);
  });

  test('sumOverSum aggregator should calculate the ratio correctly', () => {
    const sumOverSumAggregator = aggregators.sumOverSum(['numerator', 'denominator'])();
    sumOverSumAggregator.push({ numerator: 10, denominator: 2 });
    sumOverSumAggregator.push({ numerator: 20, denominator: 5 });
    expect(sumOverSumAggregator.value()).toBeCloseTo(4); // 30 / 7.5
  });

  test('extremes aggregator should find the min value correctly', () => {
    const minAggregator = aggregators.extremes('min')(['value'])();
    minAggregator.push({ value: 10 });
    minAggregator.push({ value: 20 });
    minAggregator.push({ value: 5 });
    expect(minAggregator.value()).toBe(5);
  });

  test('extremes aggregator should find the max value correctly', () => {
    const maxAggregator = aggregators.extremes('max')(['value'])();
    maxAggregator.push({ value: 10 });
    maxAggregator.push({ value: 20 });
    maxAggregator.push({ value: 5 });
    expect(maxAggregator.value()).toBe(20);
  });

  test('runningStat aggregator should calculate the mean correctly', () => {
    const meanAggregator = aggregators.runningStat('mean', 0)(['value'])();
    meanAggregator.push({ value: 10 });
    meanAggregator.push({ value: 20 });
    meanAggregator.push({ value: 30 });
    expect(meanAggregator.value()).toBe(20);
  });

  test('runningStat aggregator should calculate the variance correctly', () => {
    const varAggregator = aggregators.runningStat('var', 0)(['value'])();
    varAggregator.push({ value: 10 });
    varAggregator.push({ value: 20 });
    varAggregator.push({ value: 30 });
    expect(varAggregator.value()).toBeCloseTo(66.67, 2); // sample variance with ddof = 0
  });

  test('runningStat aggregator should calculate the standard deviation correctly', () => {
    const stdevAggregator = aggregators.runningStat('stdev', 0)(['value'])();
    stdevAggregator.push({ value: 10 });
    stdevAggregator.push({ value: 20 });
    stdevAggregator.push({ value: 30 });
    expect(stdevAggregator.value()).toBeCloseTo(8.16, 2); // sample std dev with ddof = 0
  });
});
