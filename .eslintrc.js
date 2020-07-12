module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['@chatie', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    'import/prefer-default-export': 'off',
    'new-cap': ['error', { capIsNew: false }],
    'no-restricted-syntax': 'off',
    'sort-keys': 'off'
  },
}
 