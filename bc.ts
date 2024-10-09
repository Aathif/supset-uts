import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectPageSize, { SizeOption } from './path-to-SelectPageSize'; // Adjust the import path as necessary

describe('SelectPageSize Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    options: [[5, '5 entries'], [10, '10 entries'], [20, '20 entries']],
    current: 10,
    total: 30,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SelectPageSize {...defaultProps} />);
    expect(screen.getByText(/Show/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays the current selected option', () => {
    render(<SelectPageSize {...defaultProps} />);
    expect(screen.getByRole('combobox')).toHaveValue('10');
  });

  it('calls onChange when a new option is selected', () => {
    render(<SelectPageSize {...defaultProps} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '5' } });
    expect(mockOnChange).toHaveBeenCalledWith(5);
  });

  it('inserts current size into options if not present', () => {
    const customProps = {
      ...defaultProps,
      current: 15,
    };

    render(<SelectPageSize {...customProps} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('15');
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('uses custom renderer if provided', () => {
    const CustomRenderer = ({ current, options, onChange }: any) => (
      <div>
        <span>{`Custom: ${current}`}</span>
        <select onChange={(e) => onChange(Number(e.target.value))}>
          {options.map(([size, text]) => (
            <option key={size} value={size}>
              {text}
            </option>
          ))}
        </select>
      </div>
    );

    const customProps = {
      ...defaultProps,
      selectRenderer: CustomRenderer,
    };

    render(<SelectPageSize {...customProps} />);
    expect(screen.getByText(/Custom:/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
