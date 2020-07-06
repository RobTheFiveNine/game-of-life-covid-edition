module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:jest/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
  },
};
