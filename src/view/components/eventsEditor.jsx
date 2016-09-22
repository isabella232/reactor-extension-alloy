import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import { FieldArray } from 'redux-form';

import Field from './field';

// TODO: Replace with actual values from user's product level.
const MAX_EVENTS = 100;

const CONTEXT_EVENTS = [
  'prodView',
  'scOpen',
  'scAdd',
  'scRemove',
  'scView',
  'scCheckout',
  'purchase'
];

const createOption = value => ({
  label: value,
  value
});

const nameOptions = CONTEXT_EVENTS.map(createOption);

for (let i = 0; i < MAX_EVENTS; i++) {
  nameOptions.push(createOption(`event${i + 1}`));
}

const createEmptyRow = () => ({});

const renderEvents = ({ fields }) => {
  const rows = fields.map((field, index) => (
    <div
      key={ index }
      className="u-gapBottom2x"
    >
      <Field
        name={ `${field}.name` }
        className="u-gapRight2x"
        component={ Autocomplete }
        componentClassName="Field--short"
        placeholder="Select event"
        options={ nameOptions }
        supportValidation
      />

      <span className="Label u-gapRight">Serialize from value</span>

      <Field
        name={ `${field}.value` }
        component={ Textfield }
        componentClassName="Field--short"
        supportDataElement
      />

      <Button
        variant="minimal"
        icon="close"
        iconSize="XS"
        square
        onClick={ fields.remove.bind(this, index) }
      />
    </div>
  ));

  return (
    <section>
      { rows }
      <Button onClick={ () => fields.push(createEmptyRow()) }>Add event</Button>
    </section>
  );
};

export default () => (
  <FieldArray
    name="trackerProperties.events"
    component={ renderEvents }
  />
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    let {
      events
    } = settings.trackerProperties || {};

    events = events ? events.slice() : [];

    // Add an extra object which will ensures that there is an empty row available for the user
    // to configure their next variable.
    events.push(createEmptyRow());

    events.map(event => ({ ...event }));

    return {
      ...values,
      trackerProperties: {
        ...values.trackerProperties,
        events
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      trackerProperties
    } = values;

    const events = trackerProperties.events
      .filter(event => event.name)
      .map(event => {
        // Goals are to exclude value if it's an empty string.

        const trimmedEvent = {
          name: event.name
        };

        if (event.value) {
          trimmedEvent.value = event.value;
        }

        return trimmedEvent;
      });

    settings = {
      ...settings
    };

    if (events.length) {
      settings.trackerProperties = {
        ...settings.trackerProperties,
        events
      };
    }

    return settings;
  },
  validate(errors, values = { trackerProperties: {} }) {
    const trackerProperties = values.trackerProperties || {};
    const events = trackerProperties.events || [];
    const configuredEventNames = [];

    const eventsErrors = events.map(event => {
      const eventErrors = {};

      if (event.name) {
        if (configuredEventNames.indexOf(event.name) === -1) {
          configuredEventNames.push(event.name);
        } else {
          eventErrors.name = 'This event is already configured';
        }
      } else if (event.value) {
        eventErrors.name = 'Please provide a name';
      }

      return eventErrors;
    });

    return {
      ...errors,
      trackerProperties: {
        ...errors.trackerProperties,
        events: eventsErrors
      }
    };
  }
};
