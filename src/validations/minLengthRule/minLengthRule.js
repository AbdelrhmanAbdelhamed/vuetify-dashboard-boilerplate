import { req, len } from '../common/common'

export default (value, min, message, activateRule = true) => {
  message = message || `Minimum Characters is (${min})`

  return !activateRule || !req(value) || len(value) >= min || message
}
