import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

function updateMomentLocale(
  moment,
  relativeTime = {
    future: 'in %s',
    past: '%s ago',
    s: 'Now',
    ss: '%d sec',
    m: '1 min',
    mm: '%d mins',
    h: '1 hr',
    hh: '%d hrs',
    d: '1 day',
    dd: '%d days',
    w: '1 week',
    ww: '%d weeks',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  }
) {
  moment.updateLocale('en', {
    relativeTime,
  })
}

momentDurationFormatSetup(moment)
updateMomentLocale(moment)

export function isFromSameOrBeforeTo(from, to, format = 'HH:mm') {
  return moment(from, format).isSameOrBefore(moment(to, format))
}

export function secondsToHours(time, format = 'HH:mm', options = { trim: false }) {
  return moment.duration(time, 'seconds').format(format, options)
}

export function formatHours(time, format = 'HH:mm', options = { trim: false }) {
  return moment.duration(time, 'hours').format(format, options)
}

export function formattedTimeToHours(formattedTime) {
  return moment.duration(formattedTime).asHours()
}

export function formattedTimeToMinutes(formattedTime) {
  return moment.duration(formattedTime).asMinutes()
}

export function formattedTimeToSeconds(formattedTime) {
  return moment.duration(formattedTime).asSeconds()
}

export function isDateTimeValid(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(moment(date).format(format), format, true).isValid()
}

export function formatDate(date, fromFormat = 'YYYY-MM-DD', toFormat) {
  return moment(date, fromFormat).format(toFormat ?? fromFormat)
}

export function getLocalDate(date, dateFormat) {
  const dateUTC = moment.utc(date)
  const localDate = moment(dateUTC).local()

  return dateFormat ? localDate.format(dateFormat) : localDate
}

export function getElapsedTimeFromNow(date) {
  return getLocalDate(date).fromNow(true)
}

export function calculateTargetedDateISO({
  startDate = new Date(),
  duration = 0,
  durationUnit = 'days',
  isUTC = true,
} = {}) {
  const formatISO8601 = 'YYYY-MM-DDTHH:mm:ss[Z]'
  const date = moment(startDate).startOf('day') // get the beginning of the given start date.
  const targetDate =
    duration >= 0
      ? date.add(duration, durationUnit)
      : date.subtract(Math.abs(duration), durationUnit)
  return targetDate[isUTC ? 'utc' : 'local']().format(formatISO8601)
}

export default moment
