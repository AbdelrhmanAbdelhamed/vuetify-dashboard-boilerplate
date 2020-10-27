import './loadingOverlay'
import './vueCtkDateTimePicker'
import './vueClipboard'
import './vueInputFacade'

import { abilitiesPlugin } from '@casl/vue'
import initVuetifyDialog from './vuetifyDialog'

import _Vue from 'vue'

export function initPlugins({ Vue, store, i18n, vuetify }) {
  if (!Vue.prototype.$ability) {
    Vue.use(abilitiesPlugin, store.state.abilities.currentAbility)
  }
  if (!Vue.prototype.$dialog) {
    initVuetifyDialog({ Vue, store, i18n, vuetify })
  }
}

export function getPlugin(pluginName, Vue = _Vue) {
  return Vue.prototype[pluginName]
}
