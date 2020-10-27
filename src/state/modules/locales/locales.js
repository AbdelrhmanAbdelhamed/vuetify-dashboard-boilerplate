import i18n, { defaultLanguage } from '@plugins/i18n'
import { setRTL } from '@plugins/i18n/utils'
import { saveState, getSavedState } from '@utils'

import httpClient from '@clients/http'

export const state = {
  currentLocale: getSavedState('locales.currentLocale') || defaultLanguage,
}

export const getters = {}

export const mutations = {
  SET_CURRENT_LOCALE(state, newValue) {
    state.currentLocale = newValue
    i18n.locale = state.currentLocale
    setAcceptLanguageHeader(state.currentLocale)
    setRTL(state.currentLocale)
    saveState('locales.currentLocale', state.currentLocale)
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch, rootState, rootGetters }) {},

  setCurrentLocale({ commit }, currentLocale) {
    commit('SET_CURRENT_LOCALE', currentLocale)
  },
}

// ===
// Private helpers
// ===

function setAcceptLanguageHeader(state) {
  httpClient.setAcceptLanguageHeader(state)
}
