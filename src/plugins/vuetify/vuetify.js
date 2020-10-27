import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import LRU from 'lru-cache'

import '@styles/overrides.sass'

import themes from './themes'

import i18n from '../i18n'

Vue.use(Vuetify, {
  // Functional components are inlined at runtime by vue,
  // and cannot have a components property in their options.
  // Any Vuetify components used in a custom functional component
  // must either be registered globally (recommended),
  // or locally, wherever the custom component is used.
  components: {},
})

const themeCache = new LRU({
  max: 10,
  maxAge: 1000 * 60 * 60, // 1 hour
})

export default new Vuetify({
  theme: {
    options: {
      minifyTheme: function(css) {
        return process.env.NODE_ENV === 'production' ? css.replace(/[\r\n|\r|\n]/g, '') : css
      },
      themeCache,
      customProperties: true,
      cspNonce: 'dQw4w9WgXcQ',
      variations: true,
    },
    themes,
    dark: false,
  },
  icons: {
    iconfont: 'mdi',
  },
  rtl: false,
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
})
