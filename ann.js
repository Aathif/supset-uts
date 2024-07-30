import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tooltip, { TooltipProps } from './Tooltip';
import { safeHtmlSpan } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  styled: jest.fn((component) => component),
  safeHtmlSpan: jest.fn((content) => content),
}));

describe('Tooltip Component', () => {
  const defaultProps: TooltipProps = {
    tooltip: {
      x: 100,
      y: 200,
      content: 'Test tooltip content',
    },
  };

  it('renders correctly with tooltip content', () => {
    render(<Tooltip {...defaultProps} />);
    expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    const tooltipDiv = screen.getByText('Test tooltip content').parentElement;
    expect(tooltipDiv).toHaveStyle({
      position: 'absolute',
      top: '200px',
      left: '100px',
    });
  });

  it('renders null when tooltip is undefined', () => {
    const { container } = render(<Tooltip tooltip={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when tooltip is null', () => {
    const { container } = render(<Tooltip tooltip={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('uses safeHtmlSpan for string content', () => {
    render(<Tooltip {...defaultProps} />);
    expect(safeHtmlSpan).toHaveBeenCalledWith('Test tooltip content');
  });

  it('renders ReactNode content correctly', () => {
    const reactNodeContent = <div>ReactNode content</div>;
    render(<Tooltip tooltip={{ x: 50, y: 50, content: reactNodeContent }} />);
    expect(screen.getByText('ReactNode content')).toBeInTheDocument();
    const tooltipDiv = screen.getByText('ReactNode content').parentElement;
    expect(tooltipDiv).toHaveStyle({
      position: 'absolute',
      top: '50px',
      left: '50px',
    });
  });
});
