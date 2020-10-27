// Create custom Cypress commands and overwrite existing ones.
// https://on.cypress.io/custom-commands

import { getStore } from './utils'

Cypress.Commands.add('login', ({ username = 'admin', password = 'password' } = {}) => {
  // Manually log the user in
  cy.location('pathname').then((pathname) => {
    if (pathname === 'blank') {
      cy.visit('/')
    }
  })
  getStore().then((store) => store.dispatch('auth/login', { username, password }))
})
