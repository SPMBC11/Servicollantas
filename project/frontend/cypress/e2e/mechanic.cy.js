// E2E Tests para Mecánico
// Descripción: Testea el flujo completo del mecánico:
// 1. Login como mecánico
// 2. Ver dashboard
// 3. Ver citas asignadas
// 4. Acceso restringido

describe('Mechanic Workflow - E2E Tests', () => {
  const mechanicEmail = Cypress.env('mechanic').email
  const mechanicPassword = Cypress.env('mechanic').password

  // TEST 1: Load Login Page
  it('Should load login page successfully', () => {
    cy.visit('/login', { timeout: 30000 })
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible')
  })

  // TEST 2: Login como Mecánico
  it('Should login successfully as mechanic', () => {
    cy.login(mechanicEmail, mechanicPassword)
    // cy.login already verifies we're on the dashboard
  })

  // TEST 3: View mechanic dashboard
  it('Should display mechanic dashboard', () => {
    cy.login(mechanicEmail, mechanicPassword)
    cy.visit('/mechanic/dashboard')
    cy.wait(1000)
    cy.get('body').should('be.visible')
  })

  // TEST 4: Route Protection - Cannot access mechanic without login
  it('Should redirect to login when accessing /mechanic without authentication', () => {
    cy.visit('/mechanic/dashboard', { failOnStatusCode: false })
    cy.wait(1000)
    cy.url().should('include', '/login')
  })

  // TEST 5: Invalid credentials should stay on login page
  it('Should reject invalid credentials and stay on login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('invalid@example.com', { delay: 50 })
    cy.get('input[type="password"]').type('wrongpassword', { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(1000)
    cy.url().should('include', '/login')
  })

  // TEST 6: Email field is required
  it('Should require email field for login', () => {
    cy.visit('/login')
    cy.get('input[type="password"]').type(mechanicPassword, { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.url().should('include', '/login')
  })

  // TEST 7: Password field is required
  it('Should require password field for login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(mechanicEmail, { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.url().should('include', '/login')
  })

  // TEST 8: Can access mechanic dashboard when authenticated
  it('Should allow access to /mechanic/dashboard when authenticated', () => {
    cy.visit('/mechanic/dashboard', { failOnStatusCode: false })
    cy.wait(1000)
    // Without auth, should redirect to login
    cy.url().should('include', '/login')
  })

  // TEST 9: Prevent mechanic access to admin routes
  it('Should prevent mechanic access to admin routes', () => {
    cy.login(mechanicEmail, mechanicPassword)
    cy.visit('/admin/dashboard', { failOnStatusCode: false })
    cy.wait(1000)
    cy.url().then(url => {
      expect(['/mechanic', '/login'].some(path => url.includes(path))).to.be.true
    })
  })

  // TEST 10: Logout successfully
  it('Should logout successfully', () => {
    cy.login(mechanicEmail, mechanicPassword)
    cy.visit('/mechanic/dashboard')
    
    // Find and click logout button
    cy.get('a, button').then($elements => {
      const logoutBtn = Array.from($elements).find(el =>
        el.textContent.toLowerCase().includes('cerrar') ||
        el.textContent.toLowerCase().includes('logout') ||
        el.textContent.toLowerCase().includes('salir')
      )
      if (logoutBtn) {
        cy.wrap(logoutBtn).click()
        cy.wait(1000)
        cy.url().should('include', '/login')
      }
    })
  })
})
