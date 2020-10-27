import { req, len } from '../common/common'

export default (value, max, message, activateRule = true) => {
  message = message || `Maximum Limit Exceeded (${max})`

  return !activateRule || !req(value) || len(value) <= max || message
}
