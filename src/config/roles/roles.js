const ADMIN = {
  name: 'admin',
  description: 'Manage all',
  definePermissions({ allow, forbid, user, state, commit, dispatch }) {
    allow('manage', 'all')
  },
}

const ROLES = {
  [ADMIN.name]: ADMIN,
}

export default ROLES
