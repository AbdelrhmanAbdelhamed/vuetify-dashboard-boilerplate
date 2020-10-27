import { merge } from 'lodash'

import httpClient from '../../clients/http'

import { UserModel } from '@models'

export default class AuthService {
  constructor(client) {
    this.client = client || httpClient
  }

  resolveResponse = ({ data }) => {
    return UserModel.fromRawData(data)
  }

  login({ user, config }) {
    const normalizedConfig = merge(
      {
        successMessage: 'Login successful',
        resolveResponse: this.resolveResponse,
      },
      config
    )
    const endPoint = 'login'
    return this.client.post(endPoint, UserModel.toRawData(user), normalizedConfig)
  }

  logout({ config }) {
    const normalizedConfig = merge(
      {
        onSuccess: false,
      },
      config
    )
    const endPoint = 'logout'
    return this.client.post(endPoint, null, normalizedConfig)
  }

  resetPassword({ user, config }) {
    const normalizedConfig = merge(
      {
        successMessage: 'Reset password instructions has been sent',
      },
      config
    )

    const endPoint = 'forgot_password'

    return this.client.post(endPoint, UserModel.toRawData(user), normalizedConfig)
  }

  setAuthorizationHeader(token) {
    return this.client.setAuthorizationHeader(token)
  }

  clearAuthorizationHeader() {
    return this.client.clearAuthorizationHeader()
  }
}
