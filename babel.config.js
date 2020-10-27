module.exports = {
  // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-optional-chaining
    '@babel/plugin-proposal-optional-chaining',
    // https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-nullish-coalescing-operator
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // https://github.com/lodash/babel-plugin-lodash
    'lodash',
  ],
  env: {
    test: {
      plugins: ['require-context-hook'],
    },
  },
}
