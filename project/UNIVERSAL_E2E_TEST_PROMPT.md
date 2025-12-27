# 🎯 Prompt Universal para Generar Tests E2E Correctamente

## 📝 Formato Base (Aplicable a cualquier stack)

```
Genera una suite de pruebas E2E para [TECNOLOGÍA] en mi proyecto [STACK].

La prueba debe:

1. CONFIGURACIÓN DEL ENTORNO
   - Usar [FRAMEWORK E2E: Cypress/Selenium/Playwright]
   - Configurar la URL base como [FRONTEND_URL]
   - Backend API disponible en [BACKEND_URL]
   - Database: [DATABASE_TYPE] con datos de prueba pre-populados
   - [Anotaciones/Decoradores según el framework: @SpringBootTest, describe(), etc.]

2. INICIALIZACIÓN Y LIMPIEZA
   - [Método BeforeEach/beforeEach/antes de cada test]
     * Limpiar estado anterior
     * Navegar a la página base
     * Resetear cookies/localStorage si es necesario
   - [Método AfterEach/afterEach/después de cada test]
     * Cerrar sesión o navegar a logout
     * Limpiar datos de prueba
     * Cerrar driver/navegador si es necesario

3. ESTRUCTURA DE PRUEBA: ARRANGE-ACT-ASSERT
   - ARRANGE (Preparación):
     * Definir datos de entrada
     * Navegar a la página necesaria
     * Verificar estado inicial
   - ACT (Acción):
     * Interactuar con elementos (click, type, submit)
     * Esperar respuestas asincrónicas
     * Completar workflows
   - ASSERT (Verificación):
     * Validar cambios en UI
     * Verificar redirecciones
     * Comprobar datos en base de datos

4. ESPERAS Y SINCRONIZACIÓN (CRÍTICO - ANALOGÍA DE LA SILLA)
   - Implementar ESPERAS antes de toda interacción:
     * Esperar visibilidad de elemento: [WebDriverWait(5s) / cy.wait(2500)]
     * Esperar cambio de URL: [expected_conditions.url_contains / cy.url().should()]
     * Esperar presencia de texto: [WebDriverWait / cy.contains()]
   - NUNCA usar esperas fijas: NO [Thread.sleep(1000)] o [cy.wait(1000)]
   - Usar esperas inteligentes que reintenten
   - ANALOGÍA: "Sin WebDriverWait es como intentar sentarte en una silla que todavía construyen; 
              si no esperas a que terminen (que cargue la UI), caerás al suelo (error en test)"

5. SELECTORES Y LOCALIZADORES (ESTABLES)
   - Prioridad 1: Elementos con ID único
     * [driver.find_element(By.ID, "login-btn")] / [cy.get('#login-btn')]
   - Prioridad 2: Data attributes (data-testid)
     * [driver.find_element(By.CSS_SELECTOR, "[data-testid='user-email']")] / [cy.get('[data-testid="user-email"]')]
   - Prioridad 3: ARIA labels o contenido
     * [driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")] / [cy.contains('Login')]
   - EVITAR: Clases dinámicas, selectores que cambian

6. MANEJO DE AUTENTICACIÓN
   - Crear método/comando reutilizable para login:
     * Parámetros: email, password
     * Navegar a /login
     * Llenar credenciales
     * ESPERAR [5-10 segundos] antes de verificar redirección
     * Verificar que NO está en /login (sin verificar URL exacta)
   - Credenciales guardadas en archivo de configuración/variables de entorno
   - Nunca hardcodear credenciales en el test

7. VALIDACIONES Y ASSERTIONS
   - Verificar cambios en UI (elemento visible/invisible)
   - Verificar redirecciones (URL cambió, pero no verificar exactitud)
   - Verificar presencia de texto
   - Verificar cambios en base de datos si es crítico
   - NO usar assertions sobre timing exacto
   - NO verificar logs internos

8. ESTRUCTURA DE ARCHIVOS
   [FRAMEWORK]/
   ├── e2e/
   │   ├── [feature].spec.[ext]    (tests separados por funcionalidad)
   │   ├── fixtures/               (datos de prueba)
   │   └── helpers/                (funciones reutilizables)
   ├── support/
   │   ├── commands.[ext]          (comandos personalizados)
   │   └── config.[ext]            (configuración)
   ├── config.[ext]                (configuración principal)
   └── [config-file]               (credenciales: cypress.env.json, .env.test)

9. CREDENCIALES Y DATOS DE PRUEBA
   - Guardar en archivo separado (NO en el código):
     * cypress.env.json
     * .env.test
     * application-test.properties
   - Usar variables de entorno o context manager
   - Pre-poblar base de datos con datos de prueba
   - Considerar resetear datos antes/después de cada test

10. CASOS DE USO A VALIDAR
    Caso de uso: [DESCRIBE TU CASO, EJ: 'Admin puede crear un nuevo servicio y este aparece en la tabla']
    - Pasos principales: [listado de pasos]
    - Datos de entrada: [definir datos]
    - Resultado esperado: [qué debe suceder]
    - Validaciones: [qué se verifica]

Implementa esto siguiendo el patrón Arrange-Act-Assert.
Ejecuta el test al menos 3 veces para verificar que NO es flaky.
El resultado esperado es 100% de tests pasando de forma consistente.
```

---

## 🔄 Mapeo de Conceptos por Tecnología

| Concepto | Selenium/Java | Cypress | Playwright |
|----------|--------------|---------|-----------|
| **Setup Test** | `@BeforeEach` | `beforeEach()` | `test.beforeEach()` |
| **Teardown** | `@AfterEach` + `driver.quit()` | `afterEach()` | `test.afterEach()` |
| **WebDriverWait** | `new WebDriverWait(driver, 10)` | `cy.wait(ms)` + timeouts | `page.waitForSelector()` |
| **Find Element by ID** | `driver.findElement(By.ID, "id")` | `cy.get('#id')` | `page.locator('#id')` |
| **Find Element by Attr** | `By.CSS_SELECTOR, "[data-testid='x']"` | `cy.get('[data-testid="x"]')` | `page.locator('[data-testid="x"]')` |
| **Click** | `.click()` | `cy.click()` | `.click()` |
| **Type** | `.sendKeys("text")` | `cy.type("text")` | `.fill("text")` |
| **Wait for Visibility** | `WebDriverWait().until(EC.visibility_of_element_located())` | `cy.get().should('be.visible')` | `page.waitForSelector()` |
| **Assert Text** | `assertEquals(element.getText(), "text")` | `cy.contains("text")` | `expect(text).toContain()` |
| **Assert URL** | `driver.getCurrentUrl().contains()` | `cy.url().should('include')` | `page.url().includes()` |
| **Anotación Test** | `@Test` | `it('description', ...)` | `test('description', async ...)` |

---

## 💡 Ejemplo Práctico Genérico

### Prompts para Diferentes Casos de Uso:

#### 📱 Caso 1: Login
```
Genera un test E2E que verifique el flujo de login:
1. Usuario abre la página de login
2. Ingresa email y contraseña válidos
3. Hace click en "Iniciar Sesión"
4. Sistema espera a procesar (5 segundos mínimo)
5. Usuario es redirigido al dashboard
6. Dashboard contiene el nombre del usuario

Usar Arrange-Act-Assert, selectores estables (data-testid), 
esperas inteligentes antes de assertions, y credenciales desde archivo de config.
```

#### 📋 Caso 2: CRUD - Crear Recurso
```
Genera un test E2E que valide crear un nuevo [RECURSO]:
1. Usuario hace login como [ROL]
2. Navega a [SECCIÓN]
3. Hace click en "Nuevo [RECURSO]"
4. Llena el formulario con:
   - Campo 1: [valor]
   - Campo 2: [valor]
   - Campo 3: [valor]
5. Hace click en "Guardar"
6. Sistema muestra mensaje de éxito
7. El nuevo [RECURSO] aparece en la lista

Usar Arrange-Act-Assert, esperar 2-3 segundos después de submit,
selectores estables, y verificar visibilidad sin comprobar textos exactos.
```

#### 🔐 Caso 3: Autorización
```
Genera un test E2E que valide control de acceso:
1. Usuario hace login como [ROL RESTRINGIDO]
2. Intenta acceder a ruta protegida [/admin]
3. Sistema redirige a [/dashboard o /403]
4. Usuario NO puede ver elementos administrativos

Usar Arrange-Act-Assert, esperas antes de verificar URL,
y no hacer assertions sobre URLs exactas sino sobre redirecciones.
```

---

## ✅ Checklist Antes de Enviar el Test

- [ ] ¿Usa Arrange-Act-Assert?
- [ ] ¿Tiene esperas ANTES de cada interacción o assertion?
- [ ] ¿Las esperas son inteligentes (no `sleep/wait(1000)`)?
- [ ] ¿Usa selectores estables (ID, data-testid, contenido)?
- [ ] ¿Las credenciales están en archivo de config separado?
- [ ] ¿Tiene método de limpieza (@AfterEach/afterEach)?
- [ ] ¿Pasó al menos 3 veces sin fallar (no es flaky)?
- [ ] ¿Las assertions no verifican URLs exactas?
- [ ] ¿Se ejecuta en modo headless sin problemas?
- [ ] ¿Está documentado con comentarios claros?

---

## 🚀 Flujo de Generación de Tests

### Paso 1: Definir el Caso de Uso
```
"Admin puede crear un nuevo servicio y este aparece en la tabla"
```

### Paso 2: Aplicar el Prompt Genérico
```
Genera un test E2E [EN TECH: Cypress/Selenium/Playwright] que:
1. [Admin login]
2. [Navega a Servicios]
3. [Click en "Nuevo Servicio"]
4. [Llena formulario: nombre, descripción, precio]
5. [Click en "Guardar"]
6. [Espera 2-3 segundos]
7. [Verifica que el servicio aparece en la tabla]

Usar patrón Arrange-Act-Assert, selectores estables,
esperas inteligentes, y archivo de credenciales separado.
```

### Paso 3: Implementar
```bash
# Crear archivo de test
# Implementar Arrange-Act-Assert
# Usar selectores estables
# Agregar esperas estratégicas
```

### Paso 4: Validar
```bash
# Ejecutar 3 veces
# Verificar que pasa siempre (no flaky)
# Ejecutar en modo headless
# Documentar resultados
```

---

## 📊 Matriz de Tecnologías Soportadas

| Framework | Lenguaje | Caso de Uso | Complejidad |
|-----------|----------|-----------|------------|
| **Selenium** | Java/Python/C# | E2E complejo, múltiples navegadores | Alta |
| **Cypress** | JavaScript | E2E rápido, debugging visual | Media |
| **Playwright** | JavaScript/Python/C# | E2E moderno, múltiples navegadores | Media |
| **WebdriverIO** | JavaScript | E2E con Appium, web + mobile | Alta |
| **Puppeteer** | JavaScript | E2E headless rápido, scraping | Media |
| **Testcafé** | JavaScript | E2E sin WebDriver, muy estable | Media |

---

## 🎓 Analogía Clave (La de la Silla)

> **"Sin WebDriverWait/cy.wait es como intentar sentarte en una silla que todavía están construyendo"**

```
ESCENARIO SIN ESPERAS:
┌─────────────────────────────────────────┐
│ Test                                    │
├─────────────────────────────────────────┤
│ 1. Login (button no existe aún)         │
│ 2. Click login (❌ FALLA - no hay button)│
│ 3. (nunca llega aquí)                   │
└─────────────────────────────────────────┘

ESCENARIO CON ESPERAS:
┌─────────────────────────────────────────┐
│ Test                                    │
├─────────────────────────────────────────┤
│ 1. Login                                │
│ 2. ESPERA: "button existe" (5s)         │
│ 3. ✅ Button cargó                      │
│ 4. Click login (✅ FUNCIONA)             │
│ 5. Verificar redirección (✅ OK)        │
└─────────────────────────────────────────┘
```

**La espera = "esperar a que terminen de construir la silla"**

---

## 🔗 Referencias por Tecnología

- **Selenium**: [docs.seleniumhq.org](https://www.selenium.dev/documentation/)
- **Cypress**: [docs.cypress.io](https://docs.cypress.io/)
- **Playwright**: [playwright.dev](https://playwright.dev/)
- **WebdriverIO**: [webdriver.io](https://webdriver.io/)

---

**Versión:** 2.0 - Universal  
**Fecha:** Diciembre 23, 2025  
**Estado:** ✅ Listo para ser usado con cualquier stack
