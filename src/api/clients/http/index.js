import { invokeOrReturn } from '@utils'

import CONFIG from './config'
import Http from './Axios'
import interceptors from './interceptorList'

import i18n from '@plugins/i18n'
import loadingOverlay from '@plugins/loadingOverlay'
import { getPlugin } from '@plugins'

let overlayLoader = null

const http = new Http({
  baseURL: CONFIG.BASE_URL,
  headers: {
    client: CONFIG.HEADERS.CLIENT,
    'Content-Type': CONFIG.HEADERS.CONTENT_TYPE,
  },
  onStart: () => {
    if (!overlayLoader) overlayLoader = loadingOverlay.show()
  },
  onSuccess: (response, successMessage) => {
    const vuetifyDialog = getPlugin('$dialog')

    const message =
      invokeOrReturn(successMessage, response) ||
      response.message ||
      i18n.t('default_success_message')

    vuetifyDialog.notify.success(message)
  },
  onError: (error, errorMessage) => {
    const vuetifyDialog = getPlugin('$dialog')

    const message =
      invokeOrReturn(errorMessage, error) || error.message || i18n.t('default_error_message')

    vuetifyDialog.notify.error(message)
  },
  onFinish: () => {
    if (overlayLoader) overlayLoader = overlayLoader.hide()
  },
})

interceptors.forEach((interceptor) => http.addInterceptor(interceptor))

export default http
