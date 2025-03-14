# User Areas

- [User Areas](#user-areas)
  - [Adding A New Roleob](#adding-a-new-roleob)
  - [Route Access](#route-access)
  - [Navbar Item Access](#navbar-item-access)

## Adding A New Role

To create a user role area, you need to define its abilities through [casl](https://github.com/stalniy/casl).

you can do so by adding it to the exported roles inside [`src/config/roles/roles.js`]((<https://github.com/AbdelrhmanAbdelhamed/vuetify-dashboard-boilerplate/blob/master/src/config/roles/roles.js>)

Let's say you want to add a new marketing role. first you need to determine what subject(s) marketing role should have access to and which action(s) are allowed on those subject(s) (`read, write, update, delete`). you can use a combination of actions or you can use an alias action that combine some of them like `crud` alias action that combines (`create, read, update, delete`) actions together.

You need to define two required properties:

- name `string` is the name of the role
- definePermissions `function ( user, { allow, forbid } )`
  - user `object` is the current logged-in user (to be used with conditional permissions)
  - allow `function` to allow action(s) on subject(s)
  - forbid `function` to forbid action(s) on subject(s)

and one optional property:

- description `string` is the description of the role

In addition to any custom role specific properties like `getAccessibleRestaurants`

Here's a full [`roles.js`]((<https://github.com/AbdelrhmanAbdelhamed/vuetify-dashboard-boilerplate/blob/master/src/config/roles/roles.js>) example file:

```js
// @file src/config/roles/roles.js

const ADMIN = {
  name: 'admin',
  description: 'Manage all',
  definePermissions({ allow, forbid, user, state, commit, dispatch }) {
    // admin is allowed to do any action on all subjects
    allow('manage', 'all')
  },
  getAccessibleRestaurants: ({ config }) =>
    require('@services').restaurantsService.getList({ config }),
}

const MARKETING = {
  name: 'marketing',
  description: 'Handle marketing',
  definePermissions({ allow, forbid, user, state, commit, dispatch }) {
    allow('crud', ['Promotion', 'Notification'])
  },
}

const ROLES = {
  [ADMIN.name]: ADMIN,
  [MARKETING.name]: MARKETING,
}

export default ROLES
```

- Please refer to [`src/plugins/casl/defineAbilityFor.js`]((<https://github.com/AbdelrhmanAbdelhamed/vuetify-dashboard-boilerplate/blob/master/src/plugins/casl/defineAbilityFor.js>) to see how `ROLES` is being used.

## Route Access

In order to prevent a route from an unauthorized access you need to tie it to a specific model/subject which by default require the logged-in user to have at least read action permission on this model/subject to be able to enter the route.

- You can specify both the model name and the minimum action required on it inside the meta property of each route.

```js
// @file src/router/routes.js

export default [
  {
    path: 'users',
    name: 'users',
    meta: {
      authRequired: true, // Only logged-in user can enter this route
      // no model/subject specified
      // which means any logged-in user can enter this route
    },
    ...
  },
  {
    ...
      {
        name: 'promotions',
        path: 'promotions',
        meta: {
          authRequired: true,
          action: 'read', // default
          // logged-in user must have at least read action ability on
          // Promotion model/subject in order to be able to enter this route
          model: 'Promotion',
        },
      },
    ],
  },
]
```

- Please refer to [`src/router/index.js`]((<https://github.com/AbdelrhmanAbdelhamed/vuetify-dashboard-boilerplate/blob/master/src/router/index.js#L83>) to see how route(s) guard using `route.meta.model` to prevent unauthorized access by check if the logged-in user can perform `route.meta.action || 'read'` on `route.meta.model` and redirects to 404 page if he cannot perform this action/ability.

## Navbar Item Access

Inside [TheNavbar Component]((<https://github.com/AbdelrhmanAbdelhamed/vuetify-dashboard-boilerplate/blob/master/src/components/Common/TheNavbar/TheNavbar.vue>) there's three types of navRoutes Items:

1. `persistentNavRoutes` (Always visible)
2. `loggedInNavRoutes` (Visible only if there's a logged-in user)
3. `loggedOutNavRoutes` (Visible only if no logged-in user)

- You can hide any navRoute item using `hide` property.

```js
// @file src/components/Common/TheNavbar/TheNavbar.vue
        ...
        {
          name: 'promotions',
          icon: 'mdi-wallet-giftcard ',
          // Hide Route if user cannot read any Promotion
          // (Doesn't have a permission to read any Promotion)
          hide: !this.$can('read', 'Promotion'),
        },
        ...
```
