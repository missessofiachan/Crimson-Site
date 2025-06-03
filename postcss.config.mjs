const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {
      // Target only modern browsers to reduce CSS bloat
      overrideBrowserslist: [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 Edge versions',
        'not IE 11',
        'not dead',
      ],
    },
  },
};

export default config;
