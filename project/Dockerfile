FROM node:22-alpine

WORKDIR /app

# Copiar archivos del backend
COPY project/backend /app

# Instalar dependencias
RUN npm install --production

# Exponer puerto
EXPOSE 4000

# Comando para iniciar
CMD ["node", "src/index.cjs"]
