import { mount } from 'enzyme';
import { DataElementSelectorButton } from '@reactor/react-components';

import React from 'react';
import ReportSuite from '../reportSuite';

const getReactComponents = (wrapper) => {
  const reportSuiteDataElementButton = wrapper.find(DataElementSelectorButton).node;

  return {
    reportSuiteDataElementButton
  };
};

describe('report suite', () => {
  let instance;
  const onChangeSpy = jasmine.createSpy('onChange');

  beforeAll(() => {
    instance = mount(<ReportSuite onChange={ onChangeSpy } />);
  });

  beforeEach(() => {
    window.extensionBridge = {};
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('opens the data element selector from data element button', () => {
    const {
      reportSuiteDataElementButton
    } = getReactComponents(instance);

    window.extensionBridge.openDataElementSelector = jasmine.createSpy('openDataElementSelector')
      .and.callFake(callback => {
        callback('foo');
      });

    reportSuiteDataElementButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(onChangeSpy).toHaveBeenCalledWith(['%foo%']);
  });
});
