import React from 'react';
import { shallow } from 'enzyme';
import RowCountLabel from './RowCountLabel';
import Label from 'src/components/Label';
import { Tooltip } from 'src/components/Tooltip';
import { getNumberFormatter } from '@superset-ui/core';

// Mock getNumberFormatter
jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn().mockReturnValue(() => (value) => String(value)),
  t: jest.fn((str) => str),
  tn: jest.fn((single, plural, count) => (count === 1 ? single : plural)),
}));

describe('RowCountLabel', () => {
  it('renders loading state', () => {
    const wrapper = shallow(<RowCountLabel loading />);
    expect(wrapper.find(Label).dive().text()).toEqual('Loading...');
  });

  it('renders danger label when rowcount exceeds limit', () => {
    const wrapper = shallow(<RowCountLabel rowcount={100} limit={50} />);
    expect(wrapper.find(Label).prop('type')).toEqual('danger');
    expect(wrapper.find(Tooltip).exists()).toBe(true); // Tooltip is shown
  });

  it('renders default label when within limit', () => {
    const wrapper = shallow(<RowCountLabel rowcount={10} limit={50} />);
    expect(wrapper.find(Label).prop('type')).toEqual('default');
    expect(wrapper.find(Tooltip).exists()).toBe(false); // No Tooltip
  });

  it('renders correct formatted row count', () => {
    getNumberFormatter.mockReturnValue(() => (value) => `formatted(${value})`);
    const wrapper = shallow(<RowCountLabel rowcount={100} />);
    expect(wrapper.find('[data-test="row-count-label"]').text()).toContain(
      'formatted(100)',
    );
  });

  it('shows tooltip when rowcount equals limit', () => {
    const wrapper = shallow(<RowCountLabel rowcount={50} limit={50} />);
    expect(wrapper.find(Tooltip).exists()).toBe(true);
  });
});
