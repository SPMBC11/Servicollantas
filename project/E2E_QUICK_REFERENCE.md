# 🚀 Quick Reference - E2E Testing Commands

## Installation

```bash
cd frontend
npm install
```

Cypress se instala automáticamente como devDependency.

---

## Run Tests

### Interactive Mode (Debugging)
```bash
npm run e2e
```
✅ Abre Cypress UI  
✅ Ver tests en tiempo real  
✅ Debuggear con DevTools  
✅ Pausa y rewind  

### Headless Mode (CI/CD)
```bash
# Todos los tests
npm run e2e:run

# Solo Admin
npm run e2e:admin

# Solo Cliente
npm run e2e:client

# Solo Mecánico
npm run e2e:mechanic
```

---

## Files Structure

```
frontend/
├── cypress.config.js              ← Cypress main config
├── cypress.env.json               ← Test credentials
├── .gitignore                     ← Ignore cypress/videos
├── cypress/
│   ├── support/
│   │   ├── commands.js            ← cy.login(), cy.logout()
│   │   └── e2e.js                 ← Global setup
│   └── e2e/
│       ├── admin.cy.js            ← 12 tests
│       ├── client.cy.js           ← 13 tests
│       └── mechanic.cy.js         ← 15 tests
└── package.json                   ← Scripts + cypress dep
```

---

## Test Counts

| Role | Tests | Time | Status |
|------|-------|------|--------|
| **Admin** | 12 | 3-5 min | ✅ |
| **Client** | 13 | 4-6 min | ✅ |
| **Mechanic** | 15 | 5-7 min | ✅ |
| **TOTAL** | **40** | **12-18 min** | **✅** |

---

## Pre-requisites

```bash
# Backend running
http://localhost:4000

# Frontend running
http://localhost:5173

# Database with test users:
- admin@servicollantas.com / Admin@123456
- cliente@example.com / Cliente@123456
- mecanico@example.com / Mecanico@123456
```

---

## Documentation

- **Full Guide:** [E2E_TESTING.md](../E2E_TESTING.md)
- **Summary:** [E2E_TESTING_SUMMARY.md](../E2E_TESTING_SUMMARY.md)
- **Index:** [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)

---

## Example Test

```javascript
describe('Admin Workflow', () => {
  it('Should login and view dashboard', () => {
    cy.login('admin@servicollantas.com', 'Admin@123456')
    cy.contains('Dashboard').should('be.visible')
    cy.get('[data-testid="nav-clients"]').click()
    cy.url().should('include', '/clients')
    cy.logout()
  })
})
```

---

## Custom Commands

```javascript
// Login with any role
cy.login(email, password)

// Logout
cy.logout()

// Wait for element
cy.waitForElement(selector)

// Check notification
cy.expectNotification(type)
```

---

## Tips

1. **Use DevTools:** Press F12 in Cypress UI
2. **Inspect Elements:** Right-click → Inspect
3. **View Network:** Network tab in DevTools
4. **Screenshot:** Automatically saved on failure
5. **Video:** Recorded in cypress/videos

---

## CI/CD

Tests run automatically on GitHub Actions:

```yaml
- name: Run E2E Tests
  run: npm run e2e:run
```

Results and videos uploaded as artifacts.

---

## Troubleshooting

**Login fails?**
- Check backend is running
- Verify credentials in cypress.env.json
- Check localStorage in DevTools

**Element not found?**
- Increase timeout: `{ timeout: 10000 }`
- Use data-testid instead of class selectors
- Wait for parent element first

**Tests too slow?**
- Reduce defaultCommandTimeout in cypress.config.js
- Close other applications
- Check internet connection

---

## Next Steps

✅ Run tests locally: `npm run e2e`  
✅ Fix any issues  
✅ Commit to Git  
✅ Push to GitHub (auto-runs in CI/CD)  
✅ Use in proposals: "Enterprise-grade E2E testing"  

---

**Status:** ✅ Production Ready  
**Last Updated:** Dec 18, 2025
