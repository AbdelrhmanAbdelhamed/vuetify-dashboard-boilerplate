import { req, regex } from '../common/common'

export default (value, message, activateRule = true) => {
  message = message || `E-mail must be valid`
  const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/
  return !activateRule || !req(value) || regex(value, emailRegex) || message
}
