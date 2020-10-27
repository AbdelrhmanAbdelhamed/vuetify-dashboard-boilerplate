import Vue from 'vue'
import vuetify from 'vuetify'
import Login from './Login.vue'

describe('@views/Login/Login', () => {
  beforeEach(() => {
    Vue.use(vuetify)
  })

  it('is a valid view', () => {
    expect(Login).toBeAViewComponent()
  })

  /* it('redirects to dashboard after successful login', () => {
    const { vm } = mountLogin()

    vm.email = 'correctEmail'
    vm.password = 'correctPassword'

    const routerPush = jest.fn()
    vm.$router = { push: routerPush }
    vm.$route = { query: {} }

    expect.assertions(2)
    return vm.tryToLogIn().then(() => {
      expect(vm.authError).toEqual(null)
      expect(routerPush).toHaveBeenCalledWith({ name: 'dashboard' })
    })
  })

  it('redirects to redirectFrom query, if it exists, after successful login', () => {
    const { vm } = mountLogin()

    vm.email = 'correctEmail'
    vm.password = 'correctPassword'

    const routerPush = jest.fn()
    vm.$router = { push: routerPush }

    const redirectFrom = '/profile?someQuery'
    vm.$route = { query: { redirectFrom } }

    expect.assertions(2)
    return vm.tryToLogIn().then(() => {
      expect(vm.authError).toEqual(null)
      expect(routerPush).toHaveBeenCalledWith(redirectFrom)
    })
  })

  it('displays an error after failed login', () => {
    const { vm } = mountLogin()

    const routerPush = jest.fn()
    vm.$router = { push: routerPush }

    expect.assertions(2)
    return vm.tryToLogIn().then(() => {
      expect(vm.authError).toBeTruthy()
      expect(vm.$el.textContent).toContain('error')
    })
  })
})

function mountLogin() {
  return shallowMountView(Login, {
    ...createComponentMocks({
      store: {
        auth: {
          actions: {
            login(_, { email, password }) {
              if (email === 'correctEmail' && password === 'correctPassword') {
                return Promise.resolve('testToken')
              } else {
                return Promise.reject(new Error('testError'))
              }
            },
          },
        },
      },
    }), */
})
