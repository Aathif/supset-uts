import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipientIcon from './RecipientIcon';
import { Tooltip } from 'src/components/Tooltip';
import Icons from 'src/components/Icons';
import { RecipientIconName } from '../types';

// Mock the Tooltip and Icons to ensure rendering works correctly
jest.mock('src/components/Tooltip', () => ({ children, title }) => (
  <div>
    <span>{title}</span>
    {children}
  </div>
));

jest.mock('src/components/Icons', () => ({
  Email: () => <span>Email Icon</span>,
  Slack: () => <span>Slack Icon</span>,
}));

describe('RecipientIcon', () => {
  test('renders Email icon with tooltip', () => {
    const { getByText } = render(<RecipientIcon type={RecipientIconName.Email} />);

    // Check if the email icon is rendered
    expect(getByText('Email Icon')).toBeInTheDocument();

    // Check if the tooltip for the email icon is correct
    expect(getByText(RecipientIconName.Email)).toBeInTheDocument();
  });

  test('renders Slack icon with tooltip', () => {
    const { getByText } = render(<RecipientIcon type={RecipientIconName.Slack} />);

    // Check if the Slack icon is rendered
    expect(getByText('Slack Icon')).toBeInTheDocument();

    // Check if the tooltip for the Slack icon is correct
    expect(getByText(RecipientIconName.Slack)).toBeInTheDocument();
  });

  test('renders nothing for unsupported icon type', () => {
    const { container } = render(<RecipientIcon type="unsupported" />);

    // Check if the component renders null for unsupported types
    expect(container.firstChild).toBeNull();
  });
});
