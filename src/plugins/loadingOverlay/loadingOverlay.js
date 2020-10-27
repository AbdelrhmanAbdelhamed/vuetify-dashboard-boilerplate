import Vue from 'vue'
import loadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.use(loadingOverlay, {
  loader: 'dots',
  color: 'var(--v-primary-base)',
  height: 128,
  width: 128,
})

export default Vue.prototype.$loading
