import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import { connect } from 'react-redux';

import { change, formValueSelector } from 'redux-form';
import CoralField from '../../components/coralField';
import CURRENCY_CODE_PRESETS from '../../enums/currencyCodes';

const CURRENCY_CODE_INPUT_METHODS = {
  PRESET: 'preset',
  CUSTOM: 'custom'
};

const CURRENCY_CODE_DEFAULT = 'USD';

const presetOptions = CURRENCY_CODE_PRESETS.map(preset => ({
  label: `${preset.value} - ${preset.label}`,
  value: preset.value
}));

const CurrencyCode = ({ dispatch, currencyCodeInputMethod }) => (
  <div>
    <div>
      <CoralField
        name="trackerProperties.currencyCodeInputMethod"
        component={ Radio }
        value={ CURRENCY_CODE_INPUT_METHODS.PRESET }
        onChange={
          () => dispatch(change('default', 'trackerProperties.currencyCode', CURRENCY_CODE_DEFAULT))
        }
      >
        Preset
      </CoralField>

      {
        currencyCodeInputMethod === CURRENCY_CODE_INPUT_METHODS.PRESET ?
          <div className="FieldSubset">
            <CoralField
              name="trackerProperties.currencyCode"
              component={ Autocomplete }
              componentClassName="Field--long"
              options={ presetOptions }
            />
          </div> : null
      }
    </div>
    <div>
      <CoralField
        name="trackerProperties.currencyCodeInputMethod"
        component={ Radio }
        value={ CURRENCY_CODE_INPUT_METHODS.CUSTOM }
        onChange={
          () => dispatch(change('default', 'trackerProperties.currencyCode', ''))
        }
      >
        Custom
      </CoralField>

      {
        currencyCodeInputMethod === CURRENCY_CODE_INPUT_METHODS.CUSTOM ?
          <div className="FieldSubset">
            <CoralField
              name="trackerProperties.currencyCode"
              component={ Textfield }
              supportDataElement
            />
          </div> : null
      }
    </div>
  </div>
);

export default connect(
  state => ({
    currencyCodeInputMethod:
      formValueSelector('default')(state, 'trackerProperties.currencyCodeInputMethod')
  })
)(CurrencyCode);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      currencyCode
    } = settings.trackerProperties || {};

    const currencyCodeInputMethod =
      !currencyCode || CURRENCY_CODE_PRESETS.map((currency) => currency.value)
        .indexOf(currencyCode) !== -1 ?
          CURRENCY_CODE_INPUT_METHODS.PRESET :
          CURRENCY_CODE_INPUT_METHODS.CUSTOM;

    return {
      ...values,
      trackerProperties: {
        ...values.trackerProperties,
        currencyCodeInputMethod,
        currencyCode: currencyCode || CURRENCY_CODE_DEFAULT
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      currencyCode
    } = values.trackerProperties;

    const trackerProperties = {
      ...settings.trackerProperties
    };

    // Not setting currencyCode on trackerProperties implies USD.
    if (currencyCode && currencyCode !== CURRENCY_CODE_DEFAULT) {
      trackerProperties.currencyCode = currencyCode;
    }

    return {
      ...settings,
      trackerProperties
    };
  }
};
