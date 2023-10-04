/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // files from this project
    './**/*.{tsx,ts}',
    // make sure to "see" the classnames from the UI package's files as well
    '**/packages/**/src/**/*.{tsx,ts}',
    'web/**/*.{tsx,ts}',
    '../../web/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        'm1': 'max-content 1fr',
        '1m': '1fr max-content',
        'mm1': 'max-content max-content 1fr',
        'm1m': 'max-content 1fr max-content',
        'mmm': 'repeat(3, max-content)',
      },
      gridTemplateColumns: {
        'm1': 'max-content 1fr',
        '1m': '1fr max-content',
        'mmm': 'repeat(3, max-content)',
        'mmmm': 'repeat(4, max-content)',
        'mmmm1m': 'max-content max-content max-content max-content 1fr max-content',
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
        xxxs: ['0.5rem', '0.625rem'],
      },
      maxWidth: {
        desktop: '50rem',
      },
      width: {
        desktop: '50rem',
      },
      backgroundColor: {
        'main': 'white',
        'bp-gray-1': '#F5F8FA',
        'bp-gray-2': '#EBF1F5',
        'bp-gray-3': '#E1E8ED',
        'bp-gray-4': '#D8E1E8',
        'bp-gray-5': '#CED9E0',
        'bp-gray-6': '#BFCCD6',
        'bp-gray-7': '#A7B6C2',
        'bp-gray-8': '#8A9BA8',
        'bp-gray-9': '#738694',
        'bp-gray-10': '#5C7080',
        'bp-gray-11': '#394B59',
        'bp-gray-12': '#30404D',
        'bp-gray-13': '#293742',
        'bp-gray-14': '#202B33',
        'bp-gray-15': '#182026',
      },
      colors: {
        'bp-gray-1': '#F5F8FA',
        'bp-gray-2': '#EBF1F5',
        'bp-gray-3': '#E1E8ED',
        'bp-gray-4': '#D8E1E8',
        'bp-gray-5': '#CED9E0',
        'bp-gray-6': '#BFCCD6',
        'bp-gray-7': '#A7B6C2',
        'bp-gray-8': '#8A9BA8',
        'bp-gray-9': '#738694',
        'bp-gray-10': '#5C7080',
        'bp-gray-11': '#394B59',
        'bp-gray-12': '#30404D',
        'bp-gray-13': '#293742',
        'bp-gray-14': '#202B33',
        'bp-gray-15': '#182026',
      },
      animation: {
        fadein: 'fadein 0.2s ease-in-out',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
