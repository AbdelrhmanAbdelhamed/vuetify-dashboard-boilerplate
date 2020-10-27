import { ObjectToValues } from '@utils'

export const INTERCEPTOR_TYPES = {
  REQUEST: 'request',
  RESPONSE: 'response',
}

export default class Interceptor {
  constructor({ name, type, onSuccess, onError }) {
    if (!ObjectToValues(INTERCEPTOR_TYPES).includes(type)) {
      throw new Error(
        `Invalid Interceptor type for '${type}', it should be one of ${ObjectToValues(
          INTERCEPTOR_TYPES
        )}`
      )
    }

    this.id = ''
    this.name = name
    this.type = type
    this.onSuccess = onSuccess || ((configOrResponse) => configOrResponse)
    this.onError = onError || ((error) => Promise.reject(error))
  }
}
