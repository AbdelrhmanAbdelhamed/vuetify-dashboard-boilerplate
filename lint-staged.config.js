module.exports = {
  '*.js': ['npm run lint:eslint', 'npm run lint:prettier' /* 'npm run test:unit:file' */],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['npm run lint:prettier --parser json'],
  'package.json': ['npm run lint:prettier'],
  '*.vue': [
    'npm run lint:eslint',
    'npm run lint:stylelint',
    'npm run lint:prettier',
    /* 'npm run test:unit:file', */
  ],
  '*.scss': ['npm run lint:stylelint', 'npm run lint:prettier'],
  '*.md': ['npm run lint:markdownlint', 'npm run lint:prettier'],
  '*.{png,jpeg,jpg,gif,svg}': ['imagemin-lint-staged'],
}
