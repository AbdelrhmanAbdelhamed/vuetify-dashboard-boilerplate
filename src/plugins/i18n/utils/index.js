import vuetify from '../../vuetify'

import getNearestLocale from './getNearestLocale'
import isLocaleEquals from './isLocaleEquals'

import { getChoiceIndex, setDefaultChoiceIndexGet } from './choiceIndexForPlural'

import supportedLanguages from '../supportedLanguages'

export { getChoiceIndex, setDefaultChoiceIndexGet, getNearestLocale, isLocaleEquals }

export function getLocaleMessages() {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched?.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export function getAvailableLanguages(localeMessages) {
  const locales = Object.keys(localeMessages)
  return supportedLanguages.filter((supportedLanguage) =>
    locales.some((locale) => isLocaleEquals(locale, supportedLanguage.code))
  )
}

export function getDefaultLanguage(availableLanguages) {
  let matched = null
  if (!matched) {
    availableLanguages.forEach(({ code: languageCode }) => {
      if (isLocaleEquals(languageCode, navigator.language)) {
        matched = languageCode
      }
    })
  }
  return matched || process.env.VUE_APP_I18N_LOCALE || 'en'
}

export function setRTL(locale) {
  if (isLocaleEquals('ar', locale)) {
    vuetify.preset.rtl = vuetify.framework.rtl = true
  } else {
    vuetify.preset.rtl = vuetify.framework.rtl = false
  }
}
