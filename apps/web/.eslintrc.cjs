/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['react', '@chatchi/eslint-config'],
  plugins: ['react-hooks'],
  rules: {
    'max-depth': 0,
    'new-cap': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/react-in-jsx-scope': 0,
  },
};
