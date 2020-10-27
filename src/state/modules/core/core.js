export const state = {
  defaultLanguageCode: 'en-us',
}

export const getters = {
  defaultLanguage(state) {
    return {
      code: state.defaultLanguageCode,
      name: 'English',
    }
  },
}

export const mutations = {}

export const actions = {}
