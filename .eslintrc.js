module.exports = {
  extends: [
    "airbnb",
    "prettier",
    "prettier/react",
    "plugin:testcafe/recommended"
  ],
  env: {
    browser: true,
    node: true,
    jasmine: true
  },
  plugins: ["prettier", "testcafe"],
  rules: {
    "no-param-reassign": "off",
    "prettier/prettier": "error",
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "react/forbid-prop-types": "off",
    "jsx-a11y/label-has-associated-control": [
      2,
      {
        controlComponents: ["WrappedField"]
      }
    ],
    // Has been deprecated in favor of label-has-associated-control
    "jsx-a11y/label-has-for": "off",
    // Turning this off allows us to import devDependencies in our build tools.
    // We enable the rule in src/.eslintrc.js since that's the only place we
    // want to disallow importing extraneous dependencies.
    "import/no-extraneous-dependencies": "off"
  },
  parser: "babel-eslint"
};
