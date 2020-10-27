export default function isLocaleEquals(locale = '', localeToCompare = '') {
  const lowerCasedLocale = locale.toLowerCase()
  const lowerCasedLocaleToCompare = localeToCompare.toLowerCase()

  const localePartials = lowerCasedLocale.split('-')[0]
  const LocaleToComparePartials = lowerCasedLocaleToCompare.split('-')[0]

  return (
    lowerCasedLocaleToCompare === lowerCasedLocale ||
    LocaleToComparePartials === lowerCasedLocale ||
    LocaleToComparePartials === localePartials
  )
}
