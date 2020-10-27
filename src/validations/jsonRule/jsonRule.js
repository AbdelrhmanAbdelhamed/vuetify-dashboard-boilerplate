import { req } from '../common/common'

export default (value, message, activateRule = true) => {
  message = message || `Json must be valid`

  return !activateRule || !req(value) || isJsonStringValid(value) || message
}

export function isJsonStringValid(jsonString) {
  try {
    JSON.parse(jsonString)
  } catch (e) {
    return false
  }
  return true
}
