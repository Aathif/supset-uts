import React, { ComponentType, ChangeEventHandler } from 'react';
import { Row, FilterValue } from 'react-table';
import useAsyncState from '../utils/useAsyncState';

export interface SearchInputProps {
  count: number;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export interface GlobalFilterProps<D extends object> {
  preGlobalFilteredRows: Row<D>[];
  // filter value cannot be `undefined` otherwise React will report component
  // control type undefined error
  filterValue: string;
  setGlobalFilter: (filterValue: FilterValue) => void;
  searchInput?: ComponentType<SearchInputProps>;
}

function DefaultSearchInput({ count, value, onChange }: SearchInputProps) {
  return (
    <span className="dt-global-filter">
      Search{' '}
      <input
        className="form-control input-sm"
        placeholder={`${count} records...`}
        value={value}
        onChange={onChange}
      />
    </span>
  );
}

export default (React.memo as <T>(fn: T) => T)(function GlobalFilter<D extends object>({
  preGlobalFilteredRows,
  filterValue = '',
  searchInput,
  setGlobalFilter,
}: GlobalFilterProps<D>) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useAsyncState(
    filterValue,
    (newValue: string) => {
      if (newValue == '') {
        setGlobalFilter('');
      } else {
        setGlobalFilter(newValue || undefined);
      }
    },
    1000,
  );

  const SearchInput = searchInput || DefaultSearchInput;

  return (
    <SearchInput
      count={count}
      value={value}
      onChange={e => {
        const target = e.target as HTMLInputElement;
        e.preventDefault();
        setValue(target.value);
      }}
    />
  );
});
