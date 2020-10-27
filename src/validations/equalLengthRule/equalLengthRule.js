import { req, len } from '../common/common'

export default (value, equalTo, message, activateRule = true) => {
  message = message || `Length must equal (${equalTo})`

  return !activateRule || !req(value) || len(value) === equalTo || message
}
