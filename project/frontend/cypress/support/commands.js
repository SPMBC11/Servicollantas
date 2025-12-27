// Comando para login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login', { timeout: 30000 })
  cy.get('input[type="email"]', { timeout: 10000 }).type(email, { delay: 100 })
  cy.get('input[type="password"]', { timeout: 10000 }).type(password, { delay: 100 })
  cy.get('button[type="submit"]').click()
  cy.wait(2500) // Wait for login process and redirect
})

// Comando para logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click()
  cy.get('[data-testid="logout-btn"]').click()
  cy.url().should('include', '/login')
})

// Comando para esperar elemento visible
Cypress.Commands.add('waitForElement', (selector) => {
  cy.get(selector, { timeout: 10000 }).should('be.visible')
})

// Comando para esperar notificación
Cypress.Commands.add('expectNotification', (type = 'success') => {
  cy.get(`[role="alert"]`).should('contain', type)
})
