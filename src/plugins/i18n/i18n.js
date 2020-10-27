import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { en, ar } from 'vuetify/lib/locale'

import { merge, cloneDeep } from 'lodash'

import {
  getLocaleMessages,
  getAvailableLanguages,
  getDefaultLanguage,
  getChoiceIndex,
  setDefaultChoiceIndexGet,
  getNearestLocale,
  isLocaleEquals,
} from './utils'
import dateTimeFormats from '@locales/formats/dateTimeFormats'
import numberFormats from '@locales/formats/numberFormats'

export { getNearestLocale, isLocaleEquals }

export const localeMessages = getLocaleMessages()
export const availableLanguages = getAvailableLanguages(localeMessages)
export const defaultLanguage = getDefaultLanguage(availableLanguages)

setDefaultChoiceIndexGet(VueI18n.prototype.getChoiceIndex)

VueI18n.prototype.getChoiceIndex = getChoiceIndex

Vue.use(VueI18n)

const vuetifyDefaultLocaleMessages = {
  en: {
    $vuetify: {
      ...en,
    },
  },
  ar: {
    $vuetify: {
      ...ar,
    },
  },
}

export default new VueI18n({
  dateTimeFormats,
  numberFormats,
  locale: defaultLanguage,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: merge(cloneDeep(vuetifyDefaultLocaleMessages), localeMessages),
})
