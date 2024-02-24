// tailwind.config.js

module.exports = {
  content: [],
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#19b264',
        'dark-bg': '#101114',
        'primary-bg': '#1A1B1E',
        'secondary-bg': '#24262A',
        'card-bg': '#25282C',
      },
    },
  },
  plugins: [],
};
