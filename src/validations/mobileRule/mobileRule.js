import { req } from '../common/common'
import { isValidPhoneNumber } from '@utils'

export default (value, message, activateRule = true) => {
  message = message || `Mobile must be valid`
  return !activateRule || !req(value) || isValidPhoneNumber(value) || message
}
