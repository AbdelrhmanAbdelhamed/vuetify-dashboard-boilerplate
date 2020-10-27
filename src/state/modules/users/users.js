import { cloneDeep } from 'lodash'

import { SET_USERS, ADD_USER, UPDATE_USER, REMOVE_USER } from '@state/mutation-types'

import { usersService } from '@services'

const getUsersInitialState = () => ({
  users: [],
  pages: 0,
  page: 0,
  total: 0,
  filters: {
    query: null,
  },
})

export const state = getUsersInitialState()

export const getters = {}

export const mutations = {
  [SET_USERS](
    state,
    {
      response: { users = [], pages = 0, page = 0, total = 0 },
      filters = {
        query: null,
      },
    }
  ) {
    total = total || users.length

    state.users = users ?? state.users
    state.pages = pages ?? state.pages
    state.page = page ?? state.page
    state.total = total ?? state.total
    state.filters = filters ?? state.filters
  },
  [ADD_USER](state, newUser) {
    state.total += 1
    state.users.push(newUser)
  },
  [UPDATE_USER](state, updatedUser) {
    const userIndex = state.users.findIndex((user) => user.id === updatedUser.id)
    if (userIndex === -1) return Promise.reject(new Error('Cannot find user to update'))
    Object.assign(state.users[userIndex], { ...updatedUser })
  },
  [REMOVE_USER](state, id) {
    state.users = state.users.filter((user) => user.id !== id)
    state.total -= 1
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch, rootState, rootGetters }) {},

  async fetchUser({ commit, state, rootState }, { id, config }) {
    // 1. Check if we already have the user as a current user.
    const { currentUser } = rootState.auth
    if (currentUser && currentUser.id === id) {
      return Promise.resolve(currentUser)
    }

    // 2. Check if we've already fetched and cache the user.
    const matchedUser = state.users.find((user) => user.id === id)
    if (matchedUser) {
      return Promise.resolve(matchedUser)
    }

    // 3. Fetch the user from the API and cache it in case
    //    we need it again in the future.
    const response = await usersService.getById({ id, config })
    if (response) {
      commit(ADD_USER, response)
      return response
    }
  },
  async fetchUsers({ commit, state }, { config = {} } = {}) {
    const response = await usersService.getAll({ config })
    if (response?.users) {
      commit(SET_USERS, { response, filters: cloneDeep(config.params?.filters) })
      return response
    }
  },
  async createUser({ commit }, { item, config }) {
    const response = await usersService.create({ item, config })
    if (response) {
      commit(ADD_USER, response)
      return response
    }
  },
  async updateUser({ commit }, { item, config }) {
    const response = await usersService.update({ item, config })
    if (response) {
      commit(UPDATE_USER, response)
      return response
    }
  },
  async deleteUser({ commit }, { id, config }) {
    const response = await usersService.delete({ id, config })
    if (response) {
      commit(REMOVE_USER, id)
      return response
    }
  },
}
