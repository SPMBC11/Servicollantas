FROM node:22-alpine

WORKDIR /app

# Copiar package.json y package-lock.json primero
COPY project/backend/package*.json ./

# Instalar todas las dependencias (incluye devDependencies para build)
RUN npm install

# Copiar el resto del código
COPY project/backend .

# Exponer puerto
EXPOSE 4000

# Comando para iniciar
CMD ["node", "src/index.cjs"]
