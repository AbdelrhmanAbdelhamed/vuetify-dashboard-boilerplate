import { req, regex } from '../common/common'

export default (value, message, activateRule = true) => {
  message = message || `Must be a positive number`

  // ^[0-9]*$ - for empty string and positive integer
  return !activateRule || !req(value) || regex(value, /^[0-9]*$/) || message
}
