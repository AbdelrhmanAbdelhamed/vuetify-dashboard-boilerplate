import router from '@router'

import Interceptor, { INTERCEPTOR_TYPES } from './Interceptor'

import { getPlugin } from '@plugins'

const UnauthorizedErrorStatus = 401
const UnauthenticatedErrorStatus = 403

const deauthorizeInterceptor = new Interceptor({
  name: 'deauthorizeInterceptor',
  type: INTERCEPTOR_TYPES.RESPONSE,
  onError: (error) => {
    const shouldDeauthorizeUser =
      error.response?.status === UnauthorizedErrorStatus ||
      (error.response?.status === UnauthenticatedErrorStatus &&
        router.currentRoute.name !== 'login')

    if (shouldDeauthorizeUser) {
      const vuetifyDialog = getPlugin('$dialog')
      vuetifyDialog.clearDialogs()
      router.replace({ name: 'logout' }).catch(() => {})
    } else {
      throw error
    }
  },
})

export default [deauthorizeInterceptor]
