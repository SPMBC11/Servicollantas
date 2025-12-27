# 📋 CONTRIBUYENDO A SERVICOLLANTAS

## Introducción

¡Gracias por considerar contribuir a ServiCollantas! Este documento proporciona directrices e instrucciones para contribuir al proyecto.

## Código de Conducta

Nos comprometemos a proporcionar un ambiente acogedor para todos.

## Cómo Contribuir

### Reportar Bugs

Antes de crear un reporte de bug, verifica el historial de issues.

**Cómo enviar un buen reporte de bug:**

- Usa un título claro y descriptivo
- Describe los pasos exactos para reproducir el problema
- Proporciona ejemplos específicos para demostrar los pasos
- Describe el comportamiento observado
- Explica cuál sería el comportamiento esperado
- Incluye capturas de pantalla si es relevante

### Sugerencias de Mejoras

- Usa un título claro y descriptivo
- Proporciona una descripción detallada de la mejora sugerida
- Lista algunos ejemplos de cómo la mejora sería útil
- Menciona otros proyectos similares que tengan características parecidas

## Proceso de Pull Request

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commits con mensajes claros (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Standards de Código

- Sigue el style guide (ESLint)
- Escribe tests para funcionalidad nueva
- Asegúrate que todos los tests pasen
- Incluye un mensaje descriptivo en el PR

### Commits

Usa mensajes claros:

```
Add login functionality
Fix rate limiting on login endpoint
Update documentation for API
Refactor appointment service
```

## Setup de Desarrollo

```bash
# Clone el repo
git clone https://github.com/yourusername/servicollantas.git

# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en watch mode
npm run test:watch

# Verificar cobertura
npm test -- --coverage
```

## Linting

```bash
# Verificar errores
npm run lint

# Arreglar automáticamente
npm run lint:fix
```

## Antes de Hacer Commit

- [ ] Tests pasan (`npm test`)
- [ ] Sin errores de linting (`npm run lint`)
- [ ] Código documentado
- [ ] Commit message es claro
- [ ] No incluyes archivos `.env`

## Estructura del Proyecto

```
ServiCollantas/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── __tests__/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── types/
│   └── package.json
└── docker-compose.yml
```

## Áreas de Mejora Buscadas

- [ ] Tests adicionales
- [ ] Documentación mejorada
- [ ] Optimizaciones de rendimiento
- [ ] Nuevas features
- [ ] Internacionalización (i18n)
- [ ] Temas oscuro/claro
- [ ] Mejoras de accesibilidad

## Licencia

Al contribuir, aceptas que tu código será licenciado bajo el mismo license que el proyecto.

## Contacto

- Issues: GitHub Issues
- Email: support@servicollantas.com

¡Gracias por contribuir! 🚀
