import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomToolTip from './CustomToolTip';
import { Tooltip } from 'src/packages/superset-ui-chart-controls/src/components/Tooltip';

// Mock Tooltip to avoid actual rendering complexity
jest.mock('src/packages/superset-ui-chart-controls/src/components/Tooltip', () => ({
  __esModule: true,
  Tooltip: ({ title, children }: any) => (
    <div>
      <div data-testid="tooltip-title">{title}</div>
      {children}
    </div>
  ),
}));

describe('CustomToolTip', () => {
  const defaultProps = {
    label: 'Info',
    tooltip: 'This is an info tooltip',
    bsStyle: 'primary',
    icon: 'info-circle',
    onClick: jest.fn(),
    placement: 'top',
    className: 'custom-class',
  };

  test('renders the icon with the correct class and style', () => {
    render(<CustomToolTip {...defaultProps} />);

    const icon = screen.getByRole('button', { name: /show info tooltip/i });
    
    // Check if the icon is rendered with the correct classes
    expect(icon).toHaveClass('fa fa-info-circle custom-class text-primary');
    
    // Ensure the icon has cursor pointer when onClick is provided
    expect(icon).toHaveStyle({ cursor: 'pointer' });
  });

  test('displays the tooltip with correct content and placement', () => {
    render(<CustomToolTip {...defaultProps} />);

    // Ensure that the Tooltip contains the correct text
    const tooltip = screen.getByTestId('tooltip-title');
    expect(tooltip).toHaveTextContent(defaultProps.tooltip);
  });

  test('triggers onClick when the icon is clicked', () => {
    render(<CustomToolTip {...defaultProps} />);
    
    const icon = screen.getByRole('button', { name: /show info tooltip/i });
    
    // Simulate a click on the icon
    fireEvent.click(icon);
    
    // Check if the onClick handler was called
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('renders without onClick and does not apply pointer style', () => {
    const { onClick, ...propsWithoutClick } = defaultProps;
    render(<CustomToolTip {...propsWithoutClick} />);

    const icon = screen.getByRole('button', { name: /show info tooltip/i });

    // Check that the icon does not have pointer style
    expect(icon).not.toHaveStyle({ cursor: 'pointer' });
  });
});
