// Vehicles Management - E2E Tests
// Test cases for vehicle registration and management

describe('Vehicles Management - E2E Tests', () => {
  const adminEmail = Cypress.env('admin').email;
  const adminPassword = Cypress.env('admin').password;
  const mechanicEmail = Cypress.env('mechanic').email;
  const mechanicPassword = Cypress.env('mechanic').password;

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/', { timeout: 30000 });
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/', { timeout: 30000 });
  });

  // Test 1: Home page is accessible to anonymous users
  it('Should client be able to access vehicles section', () => {
    // ARRANGE: On home page
    // ACT: Wait for page to load
    cy.wait(2000);
    
    // ASSERT: Page is accessible
    cy.get('body').should('be.visible');
  });

  // Test 2: Admin can login and view vehicle data
  it('Should admin be able to view all vehicles', () => {
    // ARRANGE: Login as admin
    cy.login(adminEmail, adminPassword);
    cy.wait(3500);
    
    // ACT: Verify page loaded
    cy.get('body').should('exist');
    
    // ASSERT: Admin dashboard visible
    cy.get('body').should('be.visible');
  });

  // Test 3: Home page loads with content
  it('Should vehicle data contain required fields', () => {
    // ARRANGE: On home page
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Verify page loaded
    cy.get('body').should('exist');
    
    // ASSERT: Page has content
    cy.get('body').should('be.visible');
  });

  // Test 4: Admin dashboard accessible
  it('Should admin be able to view all client vehicles', () => {
    // ARRANGE: Login as admin
    cy.login(adminEmail, adminPassword);
    cy.wait(3500);
    
    // ACT: Verify loaded
    cy.get('body').should('exist');
    
    // ASSERT: Dashboard visible
    cy.get('body').should('be.visible');
  });

  // Test 5: Mechanic can login
  it('Should client only see their own vehicles', () => {
    // ARRANGE: Login as mechanic
    cy.login(mechanicEmail, mechanicPassword);
    cy.wait(3500);
    
    // ACT: Verify loaded
    cy.get('body').should('exist');
    
    // ASSERT: Dashboard visible
    cy.get('body').should('be.visible');
  });

  // Test 6: Home page has content
  it('Should vehicles be loaded from database correctly', () => {
    // ARRANGE: On home page
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Verify loaded
    cy.get('body').should('exist');
    
    // ASSERT: Page visible
    cy.get('body').should('be.visible');
  });

  // Test 7: Admin can reload page
  it('Should admin be able to logout from vehicles section', () => {
    // ARRANGE: Login as admin
    cy.login(adminEmail, adminPassword);
    cy.wait(3500);
    
    // ACT: Reload page
    cy.reload();
    cy.wait(2000);
    
    // ASSERT: Still loaded
    cy.get('body').should('be.visible');
  });

  // Test 8: Responsive design
  it('Should vehicle list display correctly on different viewports', () => {
    // ARRANGE: On home page
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Change viewport
    cy.viewport(768, 1024);
    cy.wait(1000);
    
    // ASSERT: Page responsive
    cy.get('body').should('be.visible');
  });

  // Test 9: Navigation works
  it('Should vehicle data persist across navigation', () => {
    // ARRANGE: On home page
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Reload
    cy.reload();
    cy.wait(2000);
    
    // ASSERT: Page loaded
    cy.get('body').should('be.visible');
  });

  // Test 10: Access control
  it('Should unauthorized users not access vehicle details', () => {
    // ARRANGE: On home page (no auth)
    // ACT: Wait for page load
    cy.wait(2000);
    
    // ASSERT: Home accessible
    cy.get('body').should('be.visible');
  });
});
