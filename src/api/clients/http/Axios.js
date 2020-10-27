import { cloneDeep, merge } from 'lodash'
import _axios from 'axios'

export default class Axios extends _axios.Axios {
  static defaultConfig = merge(cloneDeep(_axios.defaults), {
    method: '',
    url: '',
    params: {},
    data: {},
    headers: {
      client: '',
    },
    successMessage: '',
    errorMessage: '',
    onStart: false,
    onFinish: false,
    onSuccess: false,
    onError: false,
    resolveResponse: (response) => (response ? response.data : response),
    resolveError: (error) => (error.response ? error.response.data : error),
  })

  constructor(defaultInstanceConfig) {
    super(merge(cloneDeep(Axios.defaultConfig), defaultInstanceConfig || {}))
  }

  static create(defaultInstanceConfig) {
    return new Axios(merge(cloneDeep(Axios.defaultConfig), defaultInstanceConfig || {}))
  }

  setDefaults(defaults) {
    this.defaults = merge(cloneDeep(this.defaults), defaults || {})
  }

  setAuthorizationHeader(token) {
    this.defaults.headers.Authorization = token
  }

  clearAuthorizationHeader() {
    delete this.defaults.headers.Authorization
  }

  setAcceptLanguageHeader(language) {
    this.defaults.headers['accept-language'] = language
  }

  clearAcceptLanguageHeader() {
    delete this.defaults.headers['accept-language']
  }

  mergeConfigWithDefaults(config) {
    const mergedConfig = merge(cloneDeep(this.defaults), config)
    return mergedConfig
  }

  invokeHook(hook, ...args) {
    if (typeof hook !== 'function') return false
    hook(...args)
    return true
  }

  request(config) {
    const mergedConfig = this.mergeConfigWithDefaults(config)

    this.invokeHook(mergedConfig.onStart)

    return super
      .request(mergedConfig)
      .then((response) => {
        if (response) {
          const resolvedResponse = mergedConfig.resolveResponse(response)
          this.invokeHook(mergedConfig.onSuccess, resolvedResponse, mergedConfig.successMessage)
          return resolvedResponse
        }
      })
      .catch((error) => {
        const resolvedError = mergedConfig.resolveError(error)
        const onErrorCalled = this.invokeHook(
          mergedConfig.onError,
          resolvedError,
          mergedConfig.errorMessage,
          error.response?.status
        )
        if (!onErrorCalled || process.env.VUE_APP_MODE === 'development')
          return Promise.reject(resolvedError)
      })
      .finally(() => {
        this.invokeHook(mergedConfig.onFinish)
      })
  }

  addInterceptor(interceptor) {
    interceptor.id = this.interceptors[interceptor.type].use(
      (configOrResponse) => {
        this.invokeHook(interceptor.onSuccess, configOrResponse)
        return configOrResponse
      },
      (error) => {
        const onErrorCalled = this.invokeHook(interceptor.onError, error)
        if (!onErrorCalled || process.env.VUE_APP_MODE === 'development')
          return Promise.reject(error)
      }
    )
    return interceptor
  }

  removeInterceptor(interceptor) {
    if (!interceptor.id) return Promise.reject(new Error('Missing or invalid interceptor id'))
    return this.interceptors[interceptor.type].eject(interceptor.id)
  }
}
