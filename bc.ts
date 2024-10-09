import React from 'react';
import { formatSelectOptions } from '@superset-ui/chart-controls';

export type SizeOption = [number, string];

export interface SelectPageSizeRendererProps {
  current: number;
  options: SizeOption[];
  onChange: SelectPageSizeProps['onChange'];
}

function DefaultSelectRenderer({ current, options, onChange }: SelectPageSizeRendererProps) {
  return (
    <span className="dt-select-page-size form-inline">
      Show{' '}
      <select
        className="form-control input-sm"
        value={current}
        onBlur={() => {}}
        onChange={e => {
          onChange(Number((e.target as HTMLSelectElement).value));
        }}
      >
        {options.map(option => {
          const [size, text] = Array.isArray(option) ? option : [option, option];
          return (
            <option key={size} value={size}>
              {text}
            </option>
          );
        })}
      </select>{' '}
      entries
    </span>
  );
}

export interface SelectPageSizeProps extends SelectPageSizeRendererProps {
  total?: number;
  selectRenderer?: typeof DefaultSelectRenderer;
  onChange: (pageSize: number) => void;
}

function getOptionValue(x: SizeOption) {
  return Array.isArray(x) ? x[0] : x;
}

export default React.memo(function SelectPageSize({
  total,
  options: sizeOptions,
  current: currentSize,
  selectRenderer,
  onChange,
}: SelectPageSizeProps) {
  const sizeOptionValues = sizeOptions.map(getOptionValue);
  let options = [...sizeOptions];
  // insert current size to list
  if (
    currentSize !== undefined &&
    (currentSize !== total || !sizeOptionValues.includes(0)) &&
    !sizeOptionValues.includes(currentSize)
  ) {
    options = [...sizeOptions];
    options.splice(
      sizeOptionValues.findIndex(x => x > currentSize),
      0,
      formatSelectOptions([currentSize])[0],
    );
  }
  const current = currentSize === undefined ? sizeOptionValues[0] : currentSize;
  const SelectRenderer = selectRenderer || DefaultSelectRenderer;
  return <SelectRenderer current={current} options={options} onChange={onChange} />;
});
