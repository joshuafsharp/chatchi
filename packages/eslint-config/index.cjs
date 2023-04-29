/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
      'turbo',
      'prettier',
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    
    plugins: ['prettier'],
  
    env: {
      node: true,
      browser: true,
      es6: true,
    },
  
    parser: '@typescript-eslint/parser',
  
    parserOptions: {
      ecmaVersion: 'latest',
      requireConfigFile: false,
      ecmaFeatures: {
        jsx: true,
      },
      sourceType: 'module'
    },
  };