---
to: src/state/modules/<%= h.changeCase.param(h.inflection.pluralize(name)) %>/<%= h.changeCase.param(h.inflection.pluralize(name)) %>.js
eof_last: false
---
<%
 NAME = h.changeCase.constant(h.inflection.singularize(name))
 NAMES = h.changeCase.constant(h.inflection.pluralize(name))
 name = h.changeCase.camel(h.inflection.singularize(name))
 names = h.changeCase.camel(h.inflection.pluralize(name))
 Name = h.changeCase.pascal(h.inflection.singularize(name))
 Names = h.changeCase.pascal(h.inflection.pluralize(name))
%>
import { cloneDeep<% if (includeReorderAction) { %>, isNil <% } %>} from 'lodash'

<% if (includeReorderAction) { %>import { reOrderArrayItem } from '@utils' <% } %>

import {
  SET_<%= NAMES %>,
  <% if (includeResetStateAction) { %>RESET_<%= NAMES %>, <% } %>
  ADD_<%= NAME %>,
  UPDATE_<%= NAME %>,
  REMOVE_<%= NAME %>,
} from '@state/mutation-types'

import { <%= names %>Service } from '@services'

const get<%= Names %>InitialState = () => ({
  <%= names %>: [],
  pages: 0,
  page: 0,
  total: 0,
  filters: {
    query: null,
  },
})

export const state = get<%= Names %>InitialState()

export const getters = {}

export const mutations = {
  [SET_<%= NAMES %>](
    state,
    {
      response: { <%= names %> = [], pages = 0, page = 0, total = 0 },
      filters = {
        query: null,
      },
    }
  ) {
    total = total || <%= names %>.length

    state.<%= names %> = <%= names %> ?? state.<%= names %>
    state.pages = pages ?? state.pages
    state.page = page ?? state.page
    state.total = total ?? state.total
    state.filters = filters ?? state.filters
  },
  [RESET_<%= NAMES %>](state) {
    Object.assign(state, get<%= Names %>InitialState())
  },
  [ADD_<%= NAME %>](state, new<%= Name %>) {
    state.total += 1
    state.<%= names %>.push(new<%= Name %>)
  },
  [UPDATE_<%= NAME %>](state, updated<%= Name %>) {
    const <%= name %>Index = state.<%= names %>.findIndex((<%= name %>) => <%= name %>.id === updated<%= Name %>.id)
    if (<%= name %>Index === -1) return Promise.reject(new Error('Cannot find <%= name %> to update'))
    Object.assign(state.<%= names %>[<%= name %>Index], { ...updated<%= Name %> })
  },
  [REMOVE_<%= NAME %>](state, id) {
    state.<%= names %> = state.<%= names %>.filter((<%= name %>) => <%= name %>.id !== id)
    state.total -= 1
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch, rootState, rootGetters }) {},

  async fetch<%= Name %>({ commit, state, rootState }, { id, config }) {
    // 1. Check if we've already fetched and cache the <%= name %>.
    const matched<%= Name %> = state.<%= names %>.find((<%= name %>) => <%= name %>.id === id)
    if (matched<%= Name %>) {
      return Promise.resolve(matched<%= Name %>)
    }

    // 2. Fetch the <%= name %> from the API and cache it in case
    //    we need it again in the future.
    const response = await <%= names %>Service.getById({id, config})
    if (response) {
      commit(ADD_<%= NAME %>, response)
      return response
    }
  },
  async fetch<%= Names %>({ commit, state }, { config = {} } = {}) {
    const response = await <%= names %>Service.getAll({ config })
    if (response?.<%= names %>) {
      commit(SET_<%= NAMES %>, {
        response,
        filters: cloneDeep(config.filters),
      })
      return response
    }
  },
  async reset<%= Names %>({ commit }) {
    commit(RESET_<%= NAMES %>)
  },
  async create<%= Name %>({ commit }, { item, config }) {
    const response = await <%= names %>Service.getAll({ item, config })
    if (response) {
      commit(ADD_<%= NAME %>, response)
      return response
    }
  },
  async update<%= Name %>({ commit<% if (includeReorderAction) { %>, dispatch <% } %> }, { item, config<% if (includeReorderAction) { %>, extraPayload: { oldIndex } = {} <% } %>}) {
    const response = await <%= names %>Service.update({ item, config })
    if (response) {
      commit(UPDATE_<%= NAME %>, response)

      <% if (includeReorderAction) { %>
      if (!isNil(oldIndex) && !isNil(item.index)) {
        await dispatch('reOrder<%= Name %>', { oldIndex: oldIndex, newIndex: item.index })
      }
      <% } %>

      return response
    }
  },
  async delete<%= Name %>({ commit }, { id, config }) {
    const response = await <%= names %>Service.delete({ id, config })
    if(response) {
      commit(REMOVE_<%= NAME %>, id)
      return response
    }
  },
  <% if (includeReorderAction) { %>
  async reOrder<%= Name %>({ commit }, { newIndex, oldIndex }) {
    const reordered<%= Names %> = reOrderArrayItem(state.<%= names %>, {
      newIndex,
      oldIndex,
    })
    commit(SET_<%= NAMES %>, {
      response: { <%= names %>: reordered<%= Names %> },
    })
    return reordered<%= Names %>
  },
  <% } %>
}
