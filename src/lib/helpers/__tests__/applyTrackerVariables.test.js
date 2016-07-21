'use strict';

var publicRequire = require('../../__tests__/helpers/publicRequire');
var applyTrackerVariablesInjector = require('inject!../applyTrackerVariables');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

var getApplyTrackerVariables = function(mocks) {
  return applyTrackerVariablesInjector({
    'logger': (mocks && mocks.logger) || getLoggerMockObject(),
    'window': (mocks && mocks['window']) || {},
    'get-query-param': (mocks && mocks['get-query-param']) || function() {}
  });
};

describe('apply tracker variables', function() {
  var applyTrackerVariables;
  var tracker;

  beforeEach(function() {
    applyTrackerVariables = getApplyTrackerVariables();
    tracker = {};
  });

  it('sets link download file types on the tracker', function() {
    applyTrackerVariables(tracker, {
      linkDownloadFileTypes: ['avi', 'exe']
    });

    expect(tracker.linkDownloadFileTypes).toBe('avi,exe');
  });

  it('sets link external filters on the tracker', function() {
    applyTrackerVariables(tracker, {
      linkExternalFilters: ['http://www.page1.com', 'http://www.page2.com']
    });

    expect(tracker.linkExternalFilters).toBe('http://www.page1.com,http://www.page2.com');
  });

  it('sets link internal filters on the tracker', function() {
    applyTrackerVariables(tracker, {
      linkInternalFilters: ['tel://', 'mailto://']
    });

    expect(tracker.linkInternalFilters).toBe('tel://,mailto://');
  });

  it('sets hierarchies on the tracker', function() {
    applyTrackerVariables(tracker, {
      hierarchies: [{
        name: 'hier1',
        sections: ['a', 'b', 'c', 'd'],
        delimiter: ','
      }]
    });

    expect(tracker.hier1).toBe('a,b,c,d');
  });

  it('sets evars on the tracker', function() {
    applyTrackerVariables(tracker, {
      eVars: [
        {
          name: 'eVar1',
          type: 'value',
          value: '1'
        },
        {
          name: 'eVar2',
          type: 'alias',
          value: 'eVar1'
        },
        {
          name: 'eVar3',
          type: 'alias',
          value: 'prop1'
        }
      ]
    });

    expect(tracker.eVar1).toBe('1');
    expect(tracker.eVar2).toBe('D=v1');
    expect(tracker.eVar3).toBe('D=c1');
  });

  it('sets evars using a different prefix', function() {
    applyTrackerVariables(tracker, {
      dynamicVariablePrefix: 'a=',
      eVars: [
        {
          name: 'eVar1',
          type: 'alias',
          value: 'eVar2'
        }
      ]
    });

    expect(tracker.eVar1).toBe('a=v2');
  });

  it('sets props on the tracker', function() {
    applyTrackerVariables(tracker, {
      eVars: [
        {
          name: 'prop1',
          type: 'value',
          value: '1'
        },
        {
          name: 'prop2',
          type: 'alias',
          value: 'eVar2'
        },
        {
          name: 'prop3',
          type: 'alias',
          value: 'prop2'
        }
      ]
    });

    expect(tracker.prop1).toBe('1');
    expect(tracker.prop2).toBe('D=v2');
    expect(tracker.prop3).toBe('D=c2');
  });

  it('sets props using a different prefix', function() {
    applyTrackerVariables(tracker, {
      dynamicVariablePrefix: 'a=',
      props: [
        {
          name: 'prop1',
          type: 'alias',
          value: 'eVar2'
        }
      ]
    });

    expect(tracker.prop1).toBe('a=v2');
  });

  it('sets events on the tracker', function() {
    applyTrackerVariables(tracker, {
      events: [
        {
          name: 'prodView'
        },
        {
          name: 'scOpen',
          value: 'some'
        }
      ]
    });

    expect(tracker.events).toBe('prodView,scOpen:some');
  });

  it('sets campaigns on the tracker', function() {
    applyTrackerVariables(tracker, {
      campaign: {
        type: 'value',
        value: 'some'
      }
    });

    expect(tracker.linkTrackVars).toBe('campaign');
    expect(tracker.campaign).toBe('some');
  });

  it('sets campaigns from query param on the tracker', function() {
    applyTrackerVariables = getApplyTrackerVariables({
      'get-query-param': jasmine.createSpy('get-query-param').and.returnValue('somevalue')
    });

    applyTrackerVariables(tracker, {
      campaign: {
        type: 'queryParam',
        value: 'someparam'
      }
    });

    expect(tracker.linkTrackVars).toBe('campaign');
    expect(tracker.campaign).toBe('somevalue');
  });

  it('sets other porperties on the tracker', function() {
    applyTrackerVariables(tracker, {
      a: 'b'
    });

    expect(tracker.a).toBe('b');
  });
});