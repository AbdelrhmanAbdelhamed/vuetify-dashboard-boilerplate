import { req } from '../common/common'

export default (value, message = 'Please enter this field', activateRule = true) => {
  message = message || 'Please enter this field'
  value = typeof value === 'string' ? value.trim() : value

  return !activateRule || req(value) || message
}
