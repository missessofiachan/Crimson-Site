/** @type {import('eslint-define-config').FlatConfig[]} */
export default [
  {
    ignores: ['node_modules/', '.next/', 'out/', 'coverage/', '*.log'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin')).default,
      react: (await import('eslint-plugin-react')).default,
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-debugger': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
