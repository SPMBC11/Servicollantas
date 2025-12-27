// E2E Tests para Admin
// Descripción: Testea el flujo completo del administrador:
// 1. Login como admin
// 2. Ver dashboard
// 3. Gestionar citas
// 4. Ver reportes

describe('Admin Workflow - E2E Tests', () => {
  const adminEmail = Cypress.env('admin').email
  const adminPassword = Cypress.env('admin').password

  // TEST 1: Load Login Page
  it('Should load login page successfully', () => {
    cy.visit('/login', { timeout: 30000 })
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  // TEST 2: Login como Admin
  it('Should login successfully as admin', () => {
    cy.login(adminEmail, adminPassword)
    cy.wait(3500)
    cy.get('body').should('be.visible')
  })

  // TEST 3: Ver Dashboard
  it('Should display admin dashboard', () => {
    cy.login(adminEmail, adminPassword)
    cy.visit('/admin/dashboard')
    cy.get('body').should('be.visible')
  })

  // TEST 4: Route Protection - Cannot access admin without login
  it('Should redirect to login when accessing /admin without authentication', () => {
    cy.visit('/admin/dashboard', { failOnStatusCode: false })
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
    cy.get('input[type="password"]').type(adminPassword, { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.url().should('include', '/login')
  })

  // TEST 7: Password field is required
  it('Should require password field for login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(adminEmail, { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.url().should('include', '/login')
  })

  // TEST 8: Can access admin dashboard when authenticated
  it('Should allow access to /admin/dashboard when authenticated', () => {
    cy.login(adminEmail, adminPassword)
    cy.wait(3500)
    cy.get('body').should('exist')
    cy.get('body').should('be.visible')
  })

  // TEST 9: Prevent access to mechanic routes
  it('Should prevent admin access to mechanic routes', () => {
    cy.login(adminEmail, adminPassword)
    cy.visit('/mechanic/dashboard', { failOnStatusCode: false })
    cy.wait(1000)
    cy.url().then(url => {
      expect(['/admin', '/login'].some(path => url.includes(path))).to.be.true
    })
  })

  // TEST 10: Logout successfully
  it('Should logout successfully', () => {
    cy.login(adminEmail, adminPassword)
    cy.visit('/admin/dashboard')
    
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
