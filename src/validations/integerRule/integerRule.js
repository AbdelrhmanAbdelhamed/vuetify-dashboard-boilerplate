import { req, regex } from '../common/common'

export default (value, message, activateRule = true) => {
  message = message || `Must be a positive or negative number`

  // ^[0-9]*$ - for empty string and positive integer
  // ^-[0-9]+$ - only for negative integer (minus sign without at least 1 digit is not a number)
  return !activateRule || !req(value) || regex(value, /(^[0-9]*$)|(^-[0-9]+$)/) || message
}
