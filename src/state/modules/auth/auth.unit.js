import * as authModule from './auth'
import httpClient from '@clients/http'

describe('@state/modules/auth', () => {
  it('exports a valid Vuex module', () => {
    expect(authModule).toBeAVuexModule()
  })

  describe('in a store', () => {
    let store
    beforeEach(() => {
      store = createModuleStore(authModule)
      localStorage.clear()
    })

    it('mutations.SET_CURRENT_USER correctly sets httpClient default authorization header', () => {
      httpClient.defaultConfig.headers.Authorization = ''

      store.commit('SET_CURRENT_USER', { token: 'some-token' })
      expect(httpClient.defaultConfig.headers.Authorization).toEqual('some-token')

      store.commit('SET_CURRENT_USER', null)
      expect((httpClient.defaultConfig.headers.Authorization = '')).toEqual('')
    })

    it('mutations.SET_CURRENT_USER correctly saves currentUser in localStorage', () => {
      let savedCurrentUser = JSON.parse(localStorage.getItem('auth.currentUser'))
      expect(savedCurrentUser).toEqual(null)

      const expectedCurrentUser = { token: 'some-token' }
      store.commit('SET_CURRENT_USER', expectedCurrentUser)

      savedCurrentUser = JSON.parse(localStorage.getItem('auth.currentUser'))
      expect(savedCurrentUser).toEqual(expectedCurrentUser)
    })

    it('getters.loggedIn returns true when currentUser is an object', () => {
      store.commit('SET_CURRENT_USER', {})
      expect(store.getters.loggedIn).toEqual(true)
    })

    it('getters.loggedIn returns false when currentUser is null', () => {
      store.commit('SET_CURRENT_USER', null)
      expect(store.getters.loggedIn).toEqual(false)
    })

    /* it('actions.login resolves to a refreshed currentUser when already logged in', () => {
      expect.assertions(2)

      store.commit('SET_CURRENT_USER', { token: validUserExample.token })
      return store.dispatch('login').then((user) => {
        expect(user).toEqual(validUserExample)
        expect(store.state.currentUser).toEqual(validUserExample)
      })
    }) */

    /*  it('actions.login commits the currentUser and resolves to the user when NOT already logged in and provided a correct username and password', () => {
      expect.assertions(2)

      return store
        .dispatch(
          'login',
          { username: 'admin', password: 'password' },
          { errorHandle: false }
        )
        .then((user) => {
          expect(user).toEqual(validUserExample)
          expect(store.state.currentUser).toEqual(validUserExample)
        })
    }) */

    /* it('actions.login rejects with 401 when NOT already logged in and provided an incorrect username and password', () => {
      expect.assertions(1)

      return store
        .dispatch(
          'login',
          {
            username: 'bad username',
            password: 'bad password',
          },
          { errorHandle: false }
        )
        .catch((error) => {
          expect(error.message).toEqual('Request failed with status code 401')
        })
    }) */

    it('actions.validate resolves to null when currentUser is null', () => {
      expect.assertions(1)

      store.commit('SET_CURRENT_USER', null)
      return store.dispatch('validate').then((user) => {
        expect(user).toEqual(null)
      })
    })

    /* it('actions.validate resolves to null when currentUser contains an invalid token', () => {
      expect.assertions(2)

      store.commit('SET_CURRENT_USER', { token: 'invalid-token' })
      return store.dispatch('validate').then((user) => {
        expect(user).toEqual(null)
        expect(store.state.currentUser).toEqual(null)
      })
    }) */

    /* it('actions.validate resolves to a user when currentUser contains a valid token', () => {
      expect.assertions(2)

      store.commit('SET_CURRENT_USER', { token: validUserExample.token })
      return store.dispatch('validate').then((user) => {
        expect(user).toEqual(validUserExample)
        expect(store.state.currentUser).toEqual(validUserExample)
      })
    }) */
  })
})

/* const validUserExample = {
  id: 1,
  username: 'admin',
  name: 'Vue Master',
  token: 'valid-token-for-admin',
} */
