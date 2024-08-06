import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SafeMarkdown } from '@superset-ui/core';
import HandlebarsViewer from './HandlebarsViewer'; // Adjust the import path as needed

jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  SafeMarkdown: jest.fn(({ source }) => <div>{source}</div>),
}));

describe('HandlebarsViewer', () => {
  const templateSource = 'Hello, {{name}}!';
  const data = { name: 'John' };
  const mockGetElementById = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetElementById.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('{}'),
    });
    document.getElementById = mockGetElementById;
  });

  test('renders correctly with valid template and data', () => {
    render(<HandlebarsViewer templateSource={templateSource} data={data} />);

    expect(screen.getByText('Hello, John!')).toBeInTheDocument();
  });

  test('displays error message when template processing fails', () => {
    const invalidTemplateSource = 'Hello, {{#if name}} {{name}}!';
    render(<HandlebarsViewer templateSource={invalidTemplateSource} data={data} />);

    expect(screen.getByText(/Parse error/)).toBeInTheDocument();
  });

  test('displays loading message initially', () => {
    render(<HandlebarsViewer templateSource="" data={{}} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('calls SafeMarkdown with correct props', () => {
    render(<HandlebarsViewer templateSource={templateSource} data={data} />);

    expect(SafeMarkdown).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'Hello, John!',
        htmlSanitization: true,
        htmlSchemaOverrides: {},
      }),
      {}
    );
  });

  test('handles custom HTML sanitization settings', () => {
    mockGetElementById.mockReturnValueOnce({
      getAttribute: jest.fn().mockReturnValue(
        JSON.stringify({
          common: {
            conf: {
              HTML_SANITIZATION: false,
              HTML_SANITIZATION_SCHEMA_EXTENSIONS: { custom: 'schema' },
            },
          },
        })
      ),
    });

    render(<HandlebarsViewer templateSource={templateSource} data={data} />);

    expect(SafeMarkdown).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'Hello, John!',
        htmlSanitization: false,
        htmlSchemaOverrides: { custom: 'schema' },
      }),
      {}
    );
  });
});
