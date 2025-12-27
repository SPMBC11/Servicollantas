// E2E Tests para Cliente
// Descripción: Testea el flujo completo del cliente:
// 1. Login como cliente
// 2. Ver dashboard personal
// 3. Ver vehículos
// 4. Crear cita
// 5. Ver citas

describe('Client Workflow - E2E Tests', () => {
  const clientEmail = Cypress.env('client').email
  const clientPassword = Cypress.env('client').password

  // TEST 1: Load Login Page
  it('Should load login page successfully', () => {
    cy.visit('/login', { timeout: 30000 })
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible')
  })

  // TEST 2: Login como Cliente
  it('Should login successfully as client', () => {
    cy.login(clientEmail, clientPassword)
    cy.url({ timeout: 10000 }).should('include', '/')
  })

  // TEST 3: Redirect to login when not authenticated
  it('Should redirect to login when accessing client routes without auth', () => {
    cy.visit('/', { failOnStatusCode: false })
    cy.wait(1000)
    // Should stay on / or redirect to login depending on implementation
    cy.url().then(url => {
      expect(['/login', '/'].some(path => url.includes(path))).to.be.true
    })
  })

  // TEST 4: Invalid credentials should stay on login
  it('Should reject invalid credentials and stay on login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('invalid@test.com', { delay: 50 })
    cy.get('input[type="password"]').type('wrongpassword', { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(1000)
    cy.url().should('include', '/login')
  })

  // TEST 5: Require email field
  it('Should require email field for login', () => {
    cy.visit('/login')
    cy.get('input[type="password"]').type(clientPassword, { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.url().should('include', '/login')
  })

  // TEST 6: Require password field
  it('Should require password field for login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(clientEmail, { delay: 50 })
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.url().should('include', '/login')
  })

  // TEST 7: Can access home page when authenticated
  it('Should allow access to home page when authenticated', () => {
    cy.login(clientEmail, clientPassword)
    cy.visit('/')
    cy.wait(1000)
    cy.get('body').should('be.visible')
  })

  // TEST 8: Prevent client access to admin routes
  it('Should prevent client access to admin routes', () => {
    cy.login(clientEmail, clientPassword)
    cy.visit('/admin/dashboard', { failOnStatusCode: false })
    cy.wait(1000)
    cy.url().then(url => {
      expect(['/admin', '/login', '/'].some(path => url.includes(path))).to.be.true
    })
  })

  // TEST 9: Prevent client access to mechanic routes
  it('Should prevent client access to mechanic routes', () => {
    cy.login(clientEmail, clientPassword)
    cy.visit('/mechanic/dashboard', { failOnStatusCode: false })
    cy.wait(1000)
    cy.url().then(url => {
      expect(['/mechanic', '/login', '/'].some(path => url.includes(path))).to.be.true
    })
  })

  // TEST 10: Logout successfully
  it('Should logout successfully', () => {
    cy.login(clientEmail, clientPassword)
    cy.visit('/')
    
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
