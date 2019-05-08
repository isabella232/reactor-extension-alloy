/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import PropTypes from "prop-types";
import ErrorBoundary from "./errorBoundary";

let formikProps;

const ExtensionView = ({
  getInitialValues,
  getSettings,
  validate,
  validationSchema,
  render
}) => {
  const [{ initialized, initialValues, settings }, setState] = useState({
    initialized: false,
    initialValues: {},
    settings: {}
  });

  useEffect(() => {
    window.extensionBridge.register({
      init: options => {
        setState({
          initialized: true,
          initialValues: getInitialValues(options.settings),
          settings: options.settings
        });
      },
      getSettings: () => {
        return getSettings(formikProps.values);
      },
      validate: () => {
        const { submitForm, errors } = formikProps;
        return submitForm().then(() => Object.keys(errors).length === 0);
      }
    });
  }, []);

  return initialized ? (
    <ErrorBoundary>
      <Formik
        enableReinitialize
        onSubmit={() => {}}
        initialValues={initialValues}
        validate={validate}
        validationSchema={validationSchema}
        render={_formikProps => {
          formikProps = _formikProps;
          return render({ formikProps, settings });
        }}
      />
    </ErrorBoundary>
  ) : null;
};

ExtensionView.propTypes = {
  getInitialValues: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
  validate: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validationSchema: PropTypes.object,
  render: PropTypes.func.isRequired
};

export default ExtensionView;