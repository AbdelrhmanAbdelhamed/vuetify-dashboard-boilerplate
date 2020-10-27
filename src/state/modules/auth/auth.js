import { SET_CURRENT_USER } from '@state/mutation-types'

import { saveState, getSavedState } from '@utils'

import { UserModel } from '@models'
import { authService } from '@services'

import { ROLES } from '@config'

export const state = {
  currentUser: getSavedState('auth.currentUser')
    ? new UserModel(getSavedState('auth.currentUser'))
    : null,
}

export const mutations = {
  [SET_CURRENT_USER](state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
    setAuthorizationHeader(state)
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser
  },
  currentUserRole(state) {
    return ROLES[state.currentUser?.highestRole]
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    setAuthorizationHeader(state)
    dispatch('validate')
  },

  // Logs in the current user.
  async login({ commit, dispatch, getters }, { user, config }) {
    if (getters.loggedIn) return dispatch('validate')
    const responseUser = await authService.login({ user, config })
    if (responseUser) {
      commit(SET_CURRENT_USER, responseUser)
      await dispatch('abilities/updateAbilities', responseUser, { root: true })
      return responseUser
    }
  },

  // Logs out the current user.
  logout({ commit, dispatch }, { config = {} } = {}) {
    authService.logout({ config })

    dispatch('setCurrentUser', null)
  },

  async setCurrentUser({ commit }, currentUser) {
    commit(SET_CURRENT_USER, currentUser)
    return currentUser
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  async validate({ commit, dispatch, state }) {
    if (!state.currentUser) return Promise.resolve(null)
    return state.currentUser
  },
}

// ===
// Private helpers
// ===

function setAuthorizationHeader(state) {
  authService.setAuthorizationHeader(state.currentUser ? state.currentUser.token : '')
}
