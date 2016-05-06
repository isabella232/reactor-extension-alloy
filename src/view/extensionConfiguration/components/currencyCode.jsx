import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../../utils/openDataElementSelector';
import CURRENCY_CODE_PRESETS from '../../enums/currencyCodes';

const CURRENCY_CODE_INPUT_METHOD = {
  PRESET: 'preset',
  CUSTOM: 'custom'
};

const CURRENCY_CODE_DEFAULT = 'USD';

export default class CurrencyCode extends React.Component {
  onTypeChange = value => {
    const {
      currencyCodeInputMethod,
      currencyCode
    } = this.props.fields.trackerProperties;

    currencyCode.onChange(value === CURRENCY_CODE_INPUT_METHOD.PRESET ? CURRENCY_CODE_DEFAULT : '');
    currencyCodeInputMethod.onChange(value);
  };

  render() {
    const {
      currencyCodeInputMethod,
      currencyCode
    } = this.props.fields.trackerProperties;

    const presetOptions = CURRENCY_CODE_PRESETS.map(preset => {
      const label = `${preset.value} - ${preset.label}`;
      return (
        <Coral.Select.Item key={preset.value} value={preset.value}>
          {label}
        </Coral.Select.Item>
      );
    });

    return (
      <div>
        <div>
          <Coral.Radio
            {...currencyCodeInputMethod}
            onChange={this.onTypeChange}
            value={CURRENCY_CODE_INPUT_METHOD.PRESET}
            checked={currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHOD.PRESET}>
            Preset
          </Coral.Radio>
          {
            currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHOD.PRESET ?
              <div className="FieldSubset">
                <Coral.Select className="Field--large" {...currencyCode}>
                  {presetOptions}
                </Coral.Select>
              </div> : null
          }
        </div>
        <div>
          <Coral.Radio
            {...currencyCodeInputMethod}
            onChange={this.onTypeChange}
            value={CURRENCY_CODE_INPUT_METHOD.CUSTOM}
            checked={currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHOD.CUSTOM}>
            Custom
          </Coral.Radio>
          {
            currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHOD.CUSTOM ?
              <div className="FieldSubset">
                <Coral.Textfield {...currencyCode}/>
                <DataElementSelectorButton
                  onClick={openDataElementSelector.bind(this, currencyCode)}/>
              </div> : null
          }
        </div>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'trackerProperties.currencyCodeInputMethod',
    'trackerProperties.currencyCode'
  ],
  settingsToFormValues(values, options) {
    const {
      currencyCode
    } = options.settings.trackerProperties || {};

    const currencyCodeInputMethod =
      !currencyCode || CURRENCY_CODE_PRESETS.indexOf(currencyCode) !== -1 ?
        CURRENCY_CODE_INPUT_METHOD.PRESET :
        CURRENCY_CODE_INPUT_METHOD.CUSTOM;

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