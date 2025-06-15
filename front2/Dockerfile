# Fase de construcción
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Fase de producción
FROM node:22-alpine
WORKDIR /app

# Instala http-server para servir la app
RUN npm install -g http-server

# Copia solo los archivos del navegador (SSR está desactivado)
COPY --from=builder /app/dist/front2/browser ./browser

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Comando para servir la app
CMD ["http-server", "browser", "-p", "4000"]
