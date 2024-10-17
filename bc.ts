import React from 'react';
import { shallow } from 'enzyme';
import { RunQueryButton } from './RunQueryButton';
import Button from 'src/components/Button';

describe('RunQueryButton', () => {
  const defaultProps = {
    loading: false,
    onQuery: jest.fn(),
    onStop: jest.fn(),
    errorMessage: '',
    isNewChart: false,
    canStopQuery: true,
    chartIsStale: false,
  };

  it('renders stop button when loading is true', () => {
    const wrapper = shallow(<RunQueryButton {...defaultProps} loading />);
    const stopButton = wrapper.find(Button);
    expect(stopButton.exists()).toBe(true);
    expect(stopButton.prop('buttonStyle')).toEqual('warning');
    expect(stopButton.find('i').hasClass('fa-stop')).toBe(true);
    expect(stopButton.children().text()).toContain('Stop');
    stopButton.simulate('click');
    expect(defaultProps.onStop).toHaveBeenCalled();
  });

  it('renders run query button when loading is false and isNewChart is true', () => {
    const wrapper = shallow(
      <RunQueryButton {...defaultProps} isNewChart />,
    );
    const runButton = wrapper.find(Button);
    expect(runButton.exists()).toBe(true);
    expect(runButton.prop('buttonStyle')).toEqual('secondary');
    expect(runButton.text()).toContain('Create chart');
    runButton.simulate('click');
    expect(defaultProps.onQuery).toHaveBeenCalled();
  });

  it('renders update chart button when loading is false and isNewChart is false', () => {
    const wrapper = shallow(<RunQueryButton {...defaultProps} />);
    const runButton = wrapper.find(Button);
    expect(runButton.exists()).toBe(true);
    expect(runButton.prop('buttonStyle')).toEqual('secondary');
    expect(runButton.text()).toContain('Update chart');
  });

  it('disables run query button when there is an error message', () => {
    const wrapper = shallow(
      <RunQueryButton {...defaultProps} errorMessage="Error" />,
    );
    const runButton = wrapper.find(Button);
    expect(runButton.prop('disabled')).toBe(true);
  });

  it('uses primary button style when chart is stale', () => {
    const wrapper = shallow(
      <RunQueryButton {...defaultProps} chartIsStale />,
    );
    const runButton = wrapper.find(Button);
    expect(runButton.prop('buttonStyle')).toEqual('primary');
  });

  it('uses secondary button style when chart is not stale', () => {
    const wrapper = shallow(
      <RunQueryButton {...defaultProps} chartIsStale={false} />,
    );
    const runButton = wrapper.find(Button);
    expect(runButton.prop('buttonStyle')).toEqual('secondary');
  });
});
