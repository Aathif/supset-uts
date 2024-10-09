import fixTableHeight from './path-to-your-fixTableHeight'; // Adjust the import path as necessary
import $ from 'jquery';

describe('fixTableHeight', () => {
  let $tableDom;

  beforeEach(() => {
    // Set up the HTML structure that the function will interact with
    document.body.innerHTML = `
      <div class="dataTables_scrollHead" style="height: 50px;"></div>
      <div class="dataTables_filter" style="height: 20px;"></div>
      <div class="dataTables_length" style="height: 30px;"></div>
      <div class="dataTables_paginate" style="height: 40px;"></div>
      <div class="dataTables_scrollBody"></div>
    `;

    // Use jQuery to select the table DOM element
    $tableDom = $('.dataTables_scrollBody').closest('div');
  });

  it('should set the max-height of the scroll body correctly', () => {
    const height = 300;

    // Call the function
    fixTableHeight($tableDom, height);

    // Get the max-height value
    const maxHeight = $tableDom.find('.dataTables_scrollBody').css('max-height');

    // Calculate expected max-height
    const expectedHeight = height - 50 - 30 - 40; // 50 (head) + 30 (length) + 40 (paginate)

    // Convert to number for comparison
    expect(parseInt(maxHeight, 10)).toBe(expectedHeight);
  });

  it('should handle cases where filter and length heights are 0', () => {
    // Update the HTML to simulate no filter or length heights
    $('.dataTables_filter').remove();
    $('.dataTables_length').remove();

    const height = 300;

    // Call the function
    fixTableHeight($tableDom, height);

    // Get the max-height value
    const maxHeight = $tableDom.find('.dataTables_scrollBody').css('max-height');

    // Calculate expected max-height
    const expectedHeight = height - 50 - 0 - 40; // 50 (head) + 0 (length) + 40 (paginate)

    // Convert to number for comparison
    expect(parseInt(maxHeight, 10)).toBe(expectedHeight);
  });

  it('should handle cases with only head and pagination height', () => {
    // Update the HTML to simulate no filter or length heights
    $('.dataTables_filter').remove();
    $('.dataTables_length').remove();
    $('.dataTables_paginate').css('height', '0px');

    const height = 300;

    // Call the function
    fixTableHeight($tableDom, height);

    // Get the max-height value
    const maxHeight = $tableDom.find('.dataTables_scrollBody').css('max-height');

    // Calculate expected max-height
    const expectedHeight = height - 50 - 0 - 0; // 50 (head) + 0 (length) + 0 (paginate)

    // Convert to number for comparison
    expect(parseInt(maxHeight, 10)).toBe(expectedHeight);
  });
});
