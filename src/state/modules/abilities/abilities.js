import { UPDATE_ABILITIES, RESET_ABILITIES } from '@state/mutation-types'

import { defineAbilityFor, createAbility } from '@plugins/casl'

export const state = {
  currentAbility: createAbility([]),
}

export const mutations = {
  [UPDATE_ABILITIES](state, rules) {
    state.currentAbility.update(rules)
  },
  [RESET_ABILITIES](state) {
    state.currentAbility.update([])
  },
}

export const getters = {}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch, rootState, rootGetters }) {
    if (rootGetters['auth/loggedIn']) {
      dispatch('updateAbilities', rootState.auth.currentUser)
    }
  },
  updateAbilities({ state, commit, dispatch }, currentUser) {
    if (currentUser) {
      const currentUserAbility = defineAbilityFor({ user: currentUser, state, commit, dispatch })
      commit(UPDATE_ABILITIES, currentUserAbility.rules)
    }
  },
  resetAbilities({ state, commit, dispatch }) {
    commit(RESET_ABILITIES)
  },
}

// ===
// Private helpers
// ===
