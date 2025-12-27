// Import commands.js using ES2015 syntax
import './commands'

// Suppress uncaught exception errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

// Set baseURL
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})
