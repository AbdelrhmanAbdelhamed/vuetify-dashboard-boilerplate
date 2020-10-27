module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'API Service must have a name.'
      }
      return true
    },
  },
  {
    type: 'input',
    name: 'endPointSearchPostfix',
    message:
      '(Optional): Provide an End Point Search Postfix (that will be used in case config.params.filters is provided and not empty).',
  },
]
