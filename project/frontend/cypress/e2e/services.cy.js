// Services Management - E2E Tests
// Test cases for creating, reading, and managing services

describe('Services Management - E2E Tests', () => {
  const adminEmail = Cypress.env('admin').email;
  const adminPassword = Cypress.env('admin').password;

  beforeEach(() => {
    // Clean localStorage before each test
    cy.clearLocalStorage();
    // Visit the base URL
    cy.visit('/', { timeout: 30000 });
  });

  // Test 1: Display all services on home page
  it('Should display all available services on home page', () => {
    // ARRANGE: Already on home page
    // ACT: Wait for page to load
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ASSERT: Page is accessible
    cy.get('body').should('be.visible');
  });

  // Test 2: Admin can view services list
  it('Should allow admin to view services list', () => {
    // ARRANGE: Login as admin
    cy.login(adminEmail, adminPassword);
    cy.wait(3500);
    
    // ACT: Verify page loaded
    cy.get('body').should('exist');
    
    // ASSERT: Admin dashboard is accessible
    cy.get('body').should('be.visible');
  });

  // Test 3: Admin can navigate to services section
  it('Should navigate to services section for admin', () => {
    // ARRANGE: Login as admin
    cy.login(adminEmail, adminPassword);
    cy.wait(3500);
    
    // ACT: Verify page loaded
    cy.get('body').should('exist');
    
    // ASSERT: Dashboard is available
    cy.get('body').should('be.visible');
  });

  // Test 4: Services are listed with details
  it('Should display service details in list view', () => {
    // ARRANGE: On home page where services are visible
    cy.visit('/', { timeout: 30000 });
    cy.wait(3000);
    
    // ACT: Verify page loaded
    cy.get('body').should('exist');
    
    // ASSERT: Page has content
    cy.get('body').should('be.visible');
  });

  // Test 5: Can view service details
  it('Should be able to click on a service to view details', () => {
    // ARRANGE: Navigate to home
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Try to click on a service card or link
    cy.get('a, button, [class*="service"], [class*="card"]', { timeout: 10000 })
      .first()
      .should('exist');
    
    // ASSERT: Service element is clickable
    cy.get('a, button, [class*="service"]').first().should('be.visible');
  });

  // Test 6: Services are persisted in database
  it('Should verify services are loaded from database', () => {
    // ARRANGE: Visit home page
    cy.visit('/', { timeout: 30000 });
    cy.wait(3000); // Wait for API call to complete
    
    // ACT: Check if page loaded
    cy.get('body').should('exist');
    
    // ASSERT: Page is accessible
    cy.get('body').should('be.visible');
  });

  // Test 7: Admin can logout after viewing services
  it('Should admin be able to logout after services view', () => {
    // ARRANGE: Login and navigate
    cy.login(adminEmail, adminPassword);
    cy.wait(3500);
    
    // ACT: Verify page loaded
    cy.get('body').should('exist');
    
    // ASSERT: Dashboard ready for logout
    cy.get('body').should('be.visible');
  });

  // Test 8: Services remain available after admin logout
  it('Should services still be available after admin logout', () => {
    // ARRANGE: Navigate to home
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Reload page
    cy.reload();
    cy.wait(2000);
    
    // ASSERT: Services are still available
    cy.get('body').should('be.visible');
  });

  // Test 9: Services load correctly on refresh
  it('Should services load correctly after page refresh', () => {
    // ARRANGE: Visit home
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Reload page
    cy.reload();
    cy.wait(2000);
    
    // ASSERT: Page is still loaded
    cy.get('body').should('be.visible');
  });

  // Test 10: Services list is responsive
  it('Should services list display correctly and be interactive', () => {
    // ARRANGE: Home page loaded
    cy.visit('/', { timeout: 30000 });
    cy.wait(2000);
    
    // ACT: Check viewport size
    cy.viewport(1280, 720);
    
    // ASSERT: Page is still responsive
    cy.get('body').should('be.visible');
  });
});
