import { req } from '../common/common'
export default (value, min, message, activateRule = true) => {
  message = message || `Minimum Value is (${min})`

  return (
    !activateRule ||
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value >= +min) ||
    message
  )
}
