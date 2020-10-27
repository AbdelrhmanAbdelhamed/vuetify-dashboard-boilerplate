import { req } from '../common/common'

export default (value, min, max, message, activateRule = true) => {
  message =
    message || `Value must be less than or equal (${max}) and greater than or equal (${min})`

  return (
    !activateRule ||
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +min <= +value && +max >= +value) ||
    message
  )
}
