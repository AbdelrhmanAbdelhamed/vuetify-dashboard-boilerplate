import { req } from '../common/common'
export default (value, max, message, activateRule = true) => {
  message = message || `Maximum Limit Exceeded (${max})`

  return (
    !activateRule ||
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value <= +max) ||
    message
  )
}
