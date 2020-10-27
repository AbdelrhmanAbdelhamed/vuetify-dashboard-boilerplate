import { req, len } from '../common/common'

export default (value, min, max, message, activateRule = true) => {
  message =
    message ||
    `Characters length must be less than or equal (${max}) and greater than or equal (${min})`

  return !activateRule || !req(value) || (len(value) >= min && len(value) <= max) || message
}
