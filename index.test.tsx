import {
  getOnlyExtraFormData,
  checkIsMissingRequiredValue,
  checkIsApplyDisabled,
  useChartsVerboseMaps,
} from './yourModulePath'; // replace with the actual path
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { RootState } from 'src/dashboard/types';

const mockStore = configureStore([]);

describe('Utility Functions', () => {
  describe('getOnlyExtraFormData', () => {
    it('should extract only extraFormData from data', () => {
      const data = {
        id1: { id: 'id1', extraFormData: { foo: 'bar' } },
        id2: { id: 'id2', extraFormData: { baz: 'qux' } },
      };
      const expected = {
        id1: { foo: 'bar' },
        id2: { baz: 'qux' },
      };
      expect(getOnlyExtraFormData(data)).toEqual(expected);
    });
  });

  describe('checkIsMissingRequiredValue', () => {
    it('should return true if enableEmptyFilter is true and value is null or undefined', () => {
      const filter = {
        controlValues: { enableEmptyFilter: true },
      };

      expect(checkIsMissingRequiredValue(filter, { value: null })).toBe(true);
      expect(checkIsMissingRequiredValue(filter, { value: undefined })).toBe(true);
    });

    it('should return false if enableEmptyFilter is false or value is not null/undefined', () => {
      const filter = {
        controlValues: { enableEmptyFilter: false },
      };

      expect(checkIsMissingRequiredValue(filter, { value: null })).toBe(false);
      expect(checkIsMissingRequiredValue(filter, { value: undefined })).toBe(false);
      expect(checkIsMissingRequiredValue(filter, { value: 'value' })).toBe(false);
    });
  });

  describe('checkIsApplyDisabled', () => {
    it('should return true if dataMasks are equal or length mismatch or missing required values', () => {
      const dataMaskSelected = {
        id1: { id: 'id1', extraFormData: { foo: 'bar' } },
      };
      const dataMaskApplied = {
        id1: { id: 'id1', extraFormData: { foo: 'bar' } },
      };
      const filters = [];

      expect(checkIsApplyDisabled(dataMaskSelected, dataMaskApplied, filters)).toBe(true);
    });

    it('should return false if dataMasks are not equal and no missing required values', () => {
      const dataMaskSelected = {
        id1: { id: 'id1', extraFormData: { foo: 'bar' } },
      };
      const dataMaskApplied = {
        id1: { id: 'id1', extraFormData: { foo: 'baz' } },
      };
      const filters = [];

      expect(checkIsApplyDisabled(dataMaskSelected, dataMaskApplied, filters)).toBe(false);
    });
  });

  describe('useChartsVerboseMaps', () => {
    it('should return verbose maps for charts from state', () => {
      const initialState: RootState = {
        charts: {
          chart1: { form_data: { datasource: 'ds1' } },
        },
        datasources: {
          ds1: { verbose_map: { foo: 'Foo' } },
        },
      };

      const store = mockStore(initialState);

      const { result } = renderHook(() => useChartsVerboseMaps(), {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      });

      expect(result.current).toEqual({
        chart1: { foo: 'Foo' },
      });
    });
  });
});
