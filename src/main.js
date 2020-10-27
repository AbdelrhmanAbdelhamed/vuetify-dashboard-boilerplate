import router from '@router'
import store from '@state/store'
import App from './App.vue'
import Vue from 'vue'

// Globally register all `BaseName`prefixed components
import '@/components/register-globals.js'

// Init and Load Plugins
import { initPlugins } from '@plugins'
import vuetify from '@plugins/vuetify'
import i18n from '@plugins/i18n'

initPlugins({ Vue, store, i18n, vuetify })

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

const app = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')

// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.login()`.
  window.__app__ = app
}
