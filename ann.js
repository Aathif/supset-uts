import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FilterCard } from './FilterCard';
import { FilterCardContent } from './FilterCardContent';

// Mock props for testing
const mockFilter = { id: 'filter-1', name: 'Sample Filter' };
const mockGetPopupContainer = jest.fn(() => document.body);

describe('FilterCard', () => {
  it('should render children properly', () => {
    render(
      <FilterCard
        filter={mockFilter}
        isVisible={true}
        getPopupContainer={mockGetPopupContainer}
        placement="top"
      >
        <div>Child Content</div>
      </FilterCard>,
    );
    
    // Check if the child content is rendered
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should show and hide popover based on hover', () => {
    render(
      <FilterCard
        filter={mockFilter}
        isVisible={true}
        getPopupContainer={mockGetPopupContainer}
        placement="top"
      >
        <div>Hover over me</div>
      </FilterCard>,
    );

    // Initially, the popover should not be visible
    expect(screen.queryByText('Sample Filter')).not.toBeInTheDocument();

    // Hover over the child content to trigger popover
    const childContent = screen.getByText('Hover over me');
    fireEvent.mouseEnter(childContent);

    // Now the popover should be visible
    expect(screen.getByText('Sample Filter')).toBeInTheDocument();

    // Move mouse away to hide the popover
    fireEvent.mouseLeave(childContent);

    // The popover should disappear
    expect(screen.queryByText('Sample Filter')).not.toBeInTheDocument();
  });

  it('should not show the popover when externalIsVisible is false', () => {
    render(
      <FilterCard
        filter={mockFilter}
        isVisible={false} // external visibility is false
        getPopupContainer={mockGetPopupContainer}
        placement="top"
      >
        <div>Hover over me</div>
      </FilterCard>,
    );

    // Hover over the child content
    const childContent = screen.getByText('Hover over me');
    fireEvent.mouseEnter(childContent);

    // Popover should not be visible because externalIsVisible is false
    expect(screen.queryByText('Sample Filter')).not.toBeInTheDocument();
  });

  it('should hide popover when hidePopover function is called', () => {
    const { container } = render(
      <FilterCard
        filter={mockFilter}
        isVisible={true}
        getPopupContainer={mockGetPopupContainer}
        placement="top"
      >
        <div>Hover over me</div>
      </FilterCard>,
    );

    // Hover to show the popover
    fireEvent.mouseEnter(screen.getByText('Hover over me'));
    expect(screen.getByText('Sample Filter')).toBeInTheDocument();

    // Find and click on the hide popover button in the popover content
    const hideButton = container.querySelector('.filter-card-popover .ant-popover-close');
    if (hideButton) {
      fireEvent.click(hideButton);
    }

    // Popover should be hidden after clicking close button
    expect(screen.queryByText('Sample Filter')).not.toBeInTheDocument();
  });
});
