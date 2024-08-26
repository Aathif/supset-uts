import React from 'react';
import { render, screen } from '@testing-library/react';
import Slider, { SliderSingleProps, SliderRangeProps } from './Slider';
import AntdSlider from 'antd/lib/slider';

jest.mock('antd/lib/slider', () => jest.fn((props) => <div data-testid="antd-slider" {...props} />));

describe('Slider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Slider component', () => {
    render(<Slider min={0} max={100} />);
    const slider = screen.getByTestId('antd-slider');
    expect(slider).toBeInTheDocument();
  });

  it('passes props to AntdSlider', () => {
    const props: SliderSingleProps = {
      min: 0,
      max: 100,
      defaultValue: 50,
    };

    render(<Slider {...props} />);
    const slider = screen.getByTestId('antd-slider');

    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('defaultValue', '50');
  });

  it('renders a range slider with SliderRangeProps', () => {
    const rangeProps: SliderRangeProps = {
      range: true,
      min: 0,
      max: 100,
      defaultValue: [20, 80],
    };

    render(<Slider {...rangeProps} />);
    const slider = screen.getByTestId('antd-slider');

    expect(slider).toHaveAttribute('range', 'true');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('defaultValue', '20,80');
  });
});
