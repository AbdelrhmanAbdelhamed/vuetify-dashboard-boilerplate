import { toSnakeCase, toKebabCase } from '@utils/stringUtils'

import BaseModel from '../BaseModel/BaseModel'

import { ROLES } from '@config'

/* eslint-disable camelcase */
export default class UserModel extends BaseModel {
  static get modelName() {
    return 'User'
  }

  constructor(fields = {}) {
    const { email, firstName, lastName, avatar, token } = fields

    super(fields)

    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.avatar = avatar
    this.token = token

    // FOR TEST PURPOSES ONLY
    // REMOVE THIS
    this.roles = ['admin']
  }

  get fullName() {
    return `${this.firstName || ''} ${this.lastName || ''}`
  }

  get sortedRoles() {
    return UserModel.sortRoles(this.roles, ROLES)
  }

  get highestRole() {
    return this.sortedRoles[0]
  }

  static modelFieldsMap = {
    first_name: { name: 'firstName' },
    last_name: { name: 'lastName' },
  }

  // Order matters
  static rawFieldsMap = {
    firstName: { name: 'first_name' },
    lastName: { name: 'last_name' },
  }

  static sortRoles(userRoles, ROLES) {
    if (typeof ROLES !== 'object')
      return Promise.reject(new Error('(sortRoles): Expect ROLES to be an object'))

    return Object.keys(ROLES).filter(
      (ROLE) => userRoles.includes(toSnakeCase(ROLE)) || userRoles.includes(toKebabCase(ROLE))
    )
  }
}
