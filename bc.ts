import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For custom matchers like toBeInTheDocument
import HorizonRow from './HorizonRow';

// Mocking the canvas context for testing purposes
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  setTransform: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  fillStyle: '',
  imageSmoothingEnabled: false,
  fillText: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
}));

describe('HorizonRow', () => {
  const defaultProps = {
    className: 'test-class',
    width: 800,
    height: 20,
    data: [
      { y: 10 },
      { y: -5 },
      { y: 20 },
      { y: 15 },
      { y: -10 },
    ],
    bands: 4,
    colors: ['#4575b4', '#74add1', '#fee090', '#fdae61', '#f46d43', '#d73027'],
    colorScale: 'series',
    mode: 'offset',
    offsetX: 0,
    title: 'Test Row',
  };

  it('renders HorizonRow component with correct title and canvas', () => {
    render(<HorizonRow {...defaultProps} />);

    // Ensure the title is rendered correctly
    const titleElement = screen.getByText('Test Row');
    expect(titleElement).toBeInTheDocument();

    // Ensure the canvas is rendered with correct dimensions
    const canvasElement = screen.getByRole('img');
    expect(canvasElement).toHaveAttribute('width', defaultProps.width.toString());
    expect(canvasElement).toHaveAttribute('height', defaultProps.height.toString());
  });

  it('draws on the canvas after mounting', () => {
    const { getContext } = HTMLCanvasElement.prototype;
    render(<HorizonRow {...defaultProps} />);

    // Ensure that the getContext method was called
    expect(getContext).toHaveBeenCalledWith('2d');
    
    const context = getContext();
    
    // Check that canvas methods were called for drawing
    expect(context.clearRect).toHaveBeenCalledWith(0, 0, defaultProps.width, defaultProps.height);
    expect(context.fillRect).toHaveBeenCalled(); // Canvas drawing actions
  });

  it('updates the chart when component updates', () => {
    const { rerender, getContext } = HTMLCanvasElement.prototype;

    const newData = [
      { y: 15 },
      { y: -8 },
      { y: 30 },
      { y: 25 },
    ];

    const updatedProps = { ...defaultProps, data: newData };

    const { rerender } = render(<HorizonRow {...defaultProps} />);
    
    // Initial drawing check
    const context = getContext();
    expect(context.fillRect).toHaveBeenCalled();

    // Re-render the component with updated props
    rerender(<HorizonRow {...updatedProps} />);
    
    // Verify the canvas is updated
    expect(context.clearRect).toHaveBeenCalled();
    expect(context.fillRect).toHaveBeenCalledTimes(newData.length); // Validate updated drawing
  });

  it('renders correctly when there is no data', () => {
    render(<HorizonRow {...defaultProps} data={[]} />);
    
    // Check that no canvas drawing is triggered
    const context = HTMLCanvasElement.prototype.getContext();
    expect(context.clearRect).toHaveBeenCalled();
    expect(context.fillRect).not.toHaveBeenCalled();
  });
});
