import RootRouterView from './views/RootRouterView/RootRouterView.vue'
import store from '@state/store'

export default [
  {
    path: '/',
    name: 'root',
    redirect: store.state.locales.currentLocale,
  },
  {
    path: '/:language',
    component: RootRouterView,
    children: [
      {
        path: '',
        name: 'dashboard',
        meta: {
          authRequired: true, // Only logged-in user can enter this route
          // no model/subject specified
          // which means any logged-in user can enter this route
        },
        component: () => lazyLoadView(import('@views/Dashboard/Dashboard.vue')),
      },
      {
        path: 'users',
        name: 'users',
        meta: {
          authRequired: true,
          model: 'User',
        },
        component: () => lazyLoadView(import('@views/Users/Users.vue')),
      },
      {
        path: 'login',
        name: 'login',
        component: () => lazyLoadView(import('@views/Login/Login.vue')),
        meta: {
          beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to root instead
              next({ name: 'root' })
            } else {
              // Continue to the login page
              next()
            }
          },
        },
      },
      {
        path: 'logout',
        name: 'logout',
        meta: {
          authRequired: true,
          beforeResolve(routeTo, routeFrom, next) {
            store.dispatch('auth/logout', {
              config: {
                onStart: false,
                onSuccess: false,
                onError: false,
              },
            })

            const authRequiredOnPreviousRoute = routeFrom.matched.some(
              (route) => route.meta.authRequired
            )

            // Navigate back to previous page if auth is not required
            // or navigate to login route as a fallback
            next(
              authRequiredOnPreviousRoute
                ? {
                    name: 'login',
                    params: { language: store.state.locales.currentLocale },
                  }
                : { ...routeFrom }
            )
          },
        },
      },
      {
        path: '404',
        name: 'not_found',
        meta: {
          authRequired: true,
        },
        component: () => import('@views/_404/_404.vue'),
        // Allows props to be passed to the 404 page through route
        // params, such as `resource` to define what wasn't found.
        props: true,
      },
    ],
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: `${store.state.locales.currentLocale}/404`,
  },
]

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view/my-view.vue'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/MyView/MyView.vue')
//
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: require('@views/_Loading/_Loading.vue').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: require('@views/_Timeout/_Timeout.vue').default,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  })
}
