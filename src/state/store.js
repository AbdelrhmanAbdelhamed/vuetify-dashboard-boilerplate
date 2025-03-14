import dispatchActionForAllModules from '@utils/dispatchActionForAllModules/dispatchActionForAllModules'
import modules from './modules'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production',
})

export default store

// Automatically run the `init` action for every module,
// if one exists.
dispatchActionForAllModules('init')
