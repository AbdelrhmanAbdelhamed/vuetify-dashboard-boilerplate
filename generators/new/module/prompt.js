module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'Vuex modules must have a name.'
      }
      return true
    },
  },
  {
    type: 'confirm',
    name: 'includeReorderAction',
    message: 'include Reorder Action?',
  },
  {
    type: 'confirm',
    name: 'includeResetStateAction',
    message: 'include Reset List State Action?',
  },
]
