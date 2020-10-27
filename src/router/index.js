import store from '@state/store'
import routes from './routes'
import Vue from 'vue'
import VueRouter from 'vue-router'
// https://github.com/declandewet/vue-meta
import VueMeta from 'vue-meta'
// Adds a loading bar at the top during page loads.
import NProgress from 'nprogress/nprogress'

import { availableLanguages, getNearestLocale, isLocaleEquals } from '@plugins/i18n'

NProgress.configure({ showSpinner: false })

Vue.use(VueRouter)
Vue.use(VueMeta, {
  // The component option name that vue-meta looks for meta info on.
  keyName: 'page',
})

const router = new VueRouter({
  routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: 'history',
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

// Before each route evaluates...
router.beforeEach((routeTo, routeFrom, next) => {
  const language = routeTo.params.language

  // If this isn't an initial page load...
  if (routeFrom.name !== null) {
    // Start the route progress bar.
    NProgress.start()
  }

  const isLanguageAvailable = (language) => {
    return availableLanguages.some((availableLanguage) =>
      isLocaleEquals(availableLanguage.code, language)
    )
  }

  const isLanguageChanged = (language) => {
    return store.state.locales.currentLocale !== language
  }

  if (!isLanguageAvailable(language)) {
    return next({
      name: routeTo.name,
      params: { language: store.state.locales.currentLocale },
    })
  }

  if (isLanguageChanged(language)) {
    store.dispatch('locales/setCurrentLocale', getNearestLocale(language))
  }

  // If action ability (permission) on specific model is required
  // then by definition auth is required as well.
  // (including nested routes).
  const authRequired = routeTo.matched.some(
    (route) => !!route.meta.model || route.meta.authRequired
  )

  // Check if action ability (permission) is required on this route
  // (including nested routes).
  const permissionRequired = routeTo.matched.some((route) => !!route.meta.model)

  // Check if user has permission to access this route
  const userHasPermission = store.state.abilities.currentAbility.can(
    routeTo.meta.action || 'read',
    routeTo.meta.model
  )

  // If auth isn't required for the route, just continue.
  if (!authRequired) return next()

  // If auth is required and the user is logged in...
  if (store.getters['auth/loggedIn']) {
    // Validate the local user token...
    return store.dispatch('auth/validate').then((validUser) => {
      // Then continue to check permission if the token still represents a valid user,
      // otherwise redirect to login.
      if (!validUser) return redirectToLogin()

      const validUserCanNavigate = validUser && (userHasPermission || !permissionRequired)

      // If valid user and has permission then continue
      // otherwise redirect to root
      return validUserCanNavigate
        ? next()
        : next({
            name: 'not_found',
            params: { language: store.state.locales.currentLocale },
          })
    })
  }

  // If auth is required and the user is NOT currently logged in,
  // redirect to login.
  redirectToLogin()

  function redirectToLogin() {
    // Pass the original route to the login component
    const redirectFrom = ['dashboard', 'logout'].includes(routeTo.name) ? null : routeTo.name
    const query = redirectFrom ? { redirectFrom } : {}
    next({
      name: 'login',
      query,
      params: { language: store.state.locales.currentLocale },
    })
  }
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  // Create a `beforeResolve` hook, which fires whenever
  // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // allows us to ensure data is fetched even when params change,
  // but the resolved route does not. We put it in `meta` to
  // indicate that it's a hook we created, rather than part of
  // Vue Router (yet?).
  try {
    // For each matched route...
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        // If a `beforeResolve` hook is defined, call it with
        // the same arguments as the `beforeEnter` hook.
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            // If the user chose to redirect...
            if (args?.length) {
              // If redirecting to the same route we're coming from...
              if (routeFrom.name === args[0].name) {
                // Complete the animation of the route progress bar.
                NProgress.done()
              }
              // Complete the redirect.
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          // Otherwise, continue resolving the route.
          resolve()
        }
      })
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch (error) {
    return
  }

  // If we reach this point, continue resolving the route.
  next()
})

// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
