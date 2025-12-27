# 📚 Documentación de Testing

## Visión General

ServiCollantas incluye una suite completa de tests para garantizar la calidad y confiabilidad del código.

## Ejecutar Tests

### Tests unitarios completos con cobertura
```bash
cd backend
npm test
```

### Tests en modo watch (desarrollo)
```bash
cd backend
npm run test:watch
```

### Tests solo para servicios, repositorios y utilidades
```bash
cd backend
npm run test:unit
```

## Cobertura de Tests

La configuración de Jest requiere:
- **Branches:** 50%
- **Functions:** 50%
- **Lines:** 50%
- **Statements:** 50%

Los reportes de cobertura se generan en `backend/coverage/`.

## Estructura de Tests

```
backend/src/__tests__/
├── services/
│   ├── authService.test.js
│   ├── clientService.test.js
│   ├── appointmentService.test.js
│   └── mechanicService.test.js
├── repositories/
└── utils/
    └── response.test.js
```

## Ejemplos de Tests

### Test de Servicio
```javascript
describe('ClientService', () => {
  it('should create client successfully', async () => {
    const clientData = { name: 'John', email: 'john@example.com' };
    const result = await clientService.createClient(clientData);
    expect(result).toHaveProperty('id');
  });
});
```

### Mocking de Dependencias
```javascript
jest.mock('../../repositories/userRepository');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should verify mocked calls', () => {
    userRepository.findByEmail.mockResolvedValue(user);
    // ... test code
  });
});
```

## Testing en CI/CD

Los tests se ejecutan automáticamente en:
- Cada push a `main` o `develop`
- Cada pull request

Ver `.github/workflows/backend.yml` para más detalles.

## Cobertura por Módulo

- **Services:** 70%+ recomendado
- **Repositories:** 60%+ recomendado
- **Utils:** 80%+ recomendado
- **Controllers:** 50%+ recomendado

## Mejores Prácticas

1. **Aislamiento:** Usa mocks para aislar la unidad siendo testada
2. **Claridad:** Nombres descriptivos para tests
3. **Independencia:** Cada test debe ser independiente
4. **Setup/Teardown:** Usa `beforeEach` y `afterEach`
5. **Assertions:** Verifica una cosa por test

## Troubleshooting

### Tests fallan en CI
Verifica que todas las variables de entorno estén configuradas en GitHub Actions.

### Cobertura baja
Enfócate primero en servicios críticos (auth, appointments, invoices).

### Timeouts
Aumenta el timeout: `jest.setTimeout(10000);`
