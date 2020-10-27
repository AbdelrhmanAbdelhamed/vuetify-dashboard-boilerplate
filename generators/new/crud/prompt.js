module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'List component must have a name.'
      }
      return true
    },
  },
  {
    type: 'confirm',
    name: 'includeBaseSearch',
    message: 'Include Base Search component?',
  },
  {
    type: 'confirm',
    name: 'draggable',
    message: 'Make the list draggable?',
  },
  {
    type: 'confirm',
    name: 'hasTranslation',
    message: 'Is Model has translation fields?',
  },
]
