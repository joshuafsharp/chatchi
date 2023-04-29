/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['react', '@chatchi/eslint-config'],
  rules: {
    'max-depth': 0,
    'new-cap': 0,
  },
};
