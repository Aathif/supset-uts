import { render, screen } from '@testing-library/react';
import TableChart from './TableChart';

test('renders table with correct data', () => {
  const props = {
    height: 500,
    width: 800,
    data: [{ name: 'Item 1', value: 10 }, { name: 'Item 2', value: 20 }],
    columns: [{ key: 'name', label: 'Name' }, { key: 'value', label: 'Value', isNumeric: true }],
  };

  render(<TableChart {...props} />);

  expect(screen.getByText('Item 1')).toBeInTheDocument();
  expect(screen.getByText('Item 2')).toBeInTheDocument();
  expect(screen.getByText('Name')).toBeInTheDocument();
  expect(screen.getByText('Value')).toBeInTheDocument();
});
