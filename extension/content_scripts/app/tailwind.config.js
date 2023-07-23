// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('unfold-ui/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    // files from this project
    './src/**/*.{tsx,ts}',
    // make sure to "see" the classnames from other UI packages' files as well
    '../../../packages/unfold-ui/src/**/*.{tsx,ts}',
    '../../../packages/unfold-sdk/src/**/*.{tsx,ts}',
    '../../../packages/unfold-plugins/src/**/*.{tsx,ts}',
  ],
};
