import { countryOptions } from './path-to-countryOptions';
import countries from './path-to-countries';

jest.mock('./path-to-countries', () => ({
  uk: 'United Kingdom',
  usa: 'United States',
  italy_regions: 'Italy (regions)',
  france_regions: 'France (regions)',
  canada: 'Canada',
  south_africa: 'South Africa',
}));

describe('countryOptions', () => {
  it('should correctly map "uk" and "usa" to uppercase', () => {
    const result = countryOptions.find(([code]) => code === 'uk');
    expect(result).toEqual(['uk', 'UK']);

    const resultUSA = countryOptions.find(([code]) => code === 'usa');
    expect(resultUSA).toEqual(['usa', 'USA']);
  });

  it('should correctly map "italy_regions" and "france_regions"', () => {
    const resultItaly = countryOptions.find(([code]) => code === 'italy_regions');
    expect(resultItaly).toEqual(['italy_regions', 'Italy (regions)']);

    const resultFrance = countryOptions.find(([code]) => code === 'france_regions');
    expect(resultFrance).toEqual(['france_regions', 'France (regions)']);
  });

  it('should correctly map other countries with capitalized words', () => {
    const resultCanada = countryOptions.find(([code]) => code === 'canada');
    expect(resultCanada).toEqual(['canada', 'Canada']);

    const resultSouthAfrica = countryOptions.find(([code]) => code === 'south_africa');
    expect(resultSouthAfrica).toEqual(['south_africa', 'South Africa']);
  });

  it('should map all country keys from the "countries" object', () => {
    const keys = Object.keys(countries);
    const optionKeys = countryOptions.map(([code]) => code);

    expect(optionKeys).toEqual(keys);
  });
});
