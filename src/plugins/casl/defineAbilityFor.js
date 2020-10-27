import { toSnakeCase, toKebabCase } from '@utils/stringUtils'

import { AbilityBuilder, Ability, createAliasResolver } from '@casl/ability'

import { ROLES } from '@config'

export const resolveAction = createAliasResolver({
  crud: ['create', 'read', 'update', 'delete'],
})

export const createAbility = (rules = []) => new Ability(rules, { resolveAction })

export default function defineAbilityFor({ user, state, commit, dispatch }) {
  const { can: allow, cannot: forbid, rules } = new AbilityBuilder()

  if (
    !user.sortedRoles.every((userRole) => {
      const normalizedUserRole = ROLES[toSnakeCase(userRole)] || ROLES[toKebabCase(userRole)]
      return typeof normalizedUserRole?.definePermissions === 'function'
    })
  ) {
    return Promise.reject(
      new Error(`
      [ ${user.sortedRoles} ] has some unknown role(s).
      Make sure to define definePermissions function for missing role(s)
      `)
    )
  }

  user.sortedRoles.forEach((userRole) => {
    const normalizedUserRole = ROLES[toSnakeCase(userRole)] || ROLES[toKebabCase(userRole)]
    normalizedUserRole.definePermissions({ allow, forbid, user, state, commit, dispatch })
  })

  return new Ability(rules, { resolveAction })
}
