module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {},
  plugins: ['@typescript-eslint/eslint-plugin'],
  ignorePatterns: ['node_modules/*', '!.prettierrc.js'],
  extends: ['plugin:@typescript-eslint/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'curly': 'error',
    'eqeqeq': 'error',
  },
  globals: {
    React: 'writable',
  },
};
