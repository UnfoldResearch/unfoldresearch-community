// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('unfold-ui/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    // files from this project
    './src/**/*.{tsx,ts}',
    // make sure to "see" the classnames from other UI packages' files as well
    '../../../modules/unfold-ui/src/**/*.{tsx,ts}',
    '../../../modules/unfold-sdk/src/**/*.{tsx,ts}',
    '../../../modules/unfold-plugins/src/**/*.{tsx,ts}',
  ],
};
