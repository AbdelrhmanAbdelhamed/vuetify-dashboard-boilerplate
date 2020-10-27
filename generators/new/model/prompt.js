module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'API Model must have a name.'
      }
      return true
    },
  },
  {
    type: 'confirm',
    name: 'hasTranslation',
    message: 'Is Model has translation fields?',
  },
]
