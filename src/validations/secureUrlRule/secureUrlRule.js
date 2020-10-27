import { isSecureURL } from '@utils'
import { req } from '../common/common'

export default (value, message, activateRule = true) => {
  message = message || 'Must be valid secure (https) link!'
  return !activateRule || !req(value) || isSecureURL(value) || message
}
