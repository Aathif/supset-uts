import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@superset-ui/core';
import { Collapse } from 'antd';
import StyledPanel from './StyledPanel';

// Mock the theme to pass into ThemeProvider
const mockTheme = {
  gridUnit: 4,
  typography: {
    sizes: { s: 12 },
    weights: {
      bold: 700,
      normal: 400,
    },
  },
  colors: {
    grayscale: { base: '#333' },
    warning: { dark1: '#ff9800' },
    success: { base: '#4caf50' },
  },
};

describe('StyledPanel', () => {
  test('renders StyledPanel with custom styles and children', () => {
    const { getByText } = render(
      <ThemeProvider theme={mockTheme}>
        <Collapse>
          <StyledPanel header="Panel Header" key="1">
            <div>Panel Content</div>
          </StyledPanel>
        </Collapse>
      </ThemeProvider>,
    );

    // Check if the panel header is rendered
    expect(getByText('Panel Header')).toBeInTheDocument();

    // Check if the panel content is rendered
    expect(getByText('Panel Content')).toBeInTheDocument();
  });

  test('applies the correct styles from the theme', () => {
    const { container } = render(
      <ThemeProvider theme={mockTheme}>
        <Collapse>
          <StyledPanel header="Panel Header" key="1">
            <div>Panel Content</div>
          </StyledPanel>
        </Collapse>
      </ThemeProvider>,
    );

    const header = container.querySelector('.ant-collapse-header');

    // Check if styles are applied correctly
    expect(header).toHaveStyle(`
      padding: 0px 16px;
    `);

    const title = container.querySelector('.collapse-panel-title');
    expect(title).toHaveStyle(`
      font-size: 16px;
      font-weight: 700;
    `);

    const subtitle = container.querySelector('.collapse-panel-subtitle');
    expect(subtitle).toHaveStyle(`
      color: #333;
      font-size: 12px;
      font-weight: 400;
    `);
  });
});
