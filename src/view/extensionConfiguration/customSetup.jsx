import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';

var LOAD_PHASES = {
  BEFORE_SETTINGS: 'beforeSettings',
  AFTER_SETTINGS: 'afterSettings'
};

export default class CustomSetup extends React.Component {
  onOpenEditor = field => {
    window.extensionBridge.openCodeEditor(field.value, field.onChange);
  };

  render() {
    const {
      script,
      loadPhase
    } = this.props.fields.customSetup;

    return (
      <div>
        <Coral.Button
          className="u-gapTop"
          icon="code"
          onClick={this.onOpenEditor.bind(this, script)}>
          Open Editor
        </Coral.Button>
        <div>
          <fieldset>
            <legend><span className="Label u-gapTop">Execute custom code</span></legend>
            <div>
              <Coral.Radio
                {...loadPhase}
                value={LOAD_PHASES.BEFORE_SETTINGS}
                checked={loadPhase.value === LOAD_PHASES.BEFORE_SETTINGS}>
                Before other settings are applied
              </Coral.Radio>
              <Coral.Radio
                {...loadPhase}
                value={LOAD_PHASES.AFTER_SETTINGS}
                checked={loadPhase.value === LOAD_PHASES.AFTER_SETTINGS}>
                After other settings are applied
              </Coral.Radio>
            </div>
          </fieldset>
        </div>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'customSetup.script',
    'customSetup.loadPhase'
  ],
  settingsToFormValues(values, options) {
    const {
      script,
      loadPhase
    } = options.settings.customSetup || {};

    return {
      ...values,
      customSetup: {
        script: script,
        loadPhase: loadPhase || LOAD_PHASES.AFTER_SETTINGS
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      script,
      loadPhase
    } = values.customSetup;

    if (script) {
      settings = {
        ...settings,
        customSetup: {
          script,
          loadPhase
        }
      };
    }

    return settings;
  }
};
