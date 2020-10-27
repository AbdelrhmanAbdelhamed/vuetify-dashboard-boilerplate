import { defaultLanguage, availableLanguages } from '../i18n'

export default function getNearestLocale(locale) {
  const lowerCasedLocale = locale.toLowerCase()
  const localePartials = lowerCasedLocale.split('-')[0]

  let nearestLocale = null

  nearestLocale = availableLanguages.find(
    (language) => lowerCasedLocale === language.code.toLowerCase()
  )

  if (!nearestLocale) {
    nearestLocale = availableLanguages.find(
      (language) => localePartials === language.code.toLowerCase()
    )
  }

  if (!nearestLocale) {
    nearestLocale = availableLanguages.find((language) => {
      const languagePartials = language.code.toLowerCase().split('-')[0]
      return localePartials === languagePartials
    })
  }

  return nearestLocale.code || defaultLanguage
}
