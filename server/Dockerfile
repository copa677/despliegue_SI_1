# ===== Stage 1: builder con Node 22 =====
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar manifest (package.json + lock)
COPY package.json package-lock.json ./

# Instalar todas las dependencias (dev + prod) asegurando legacy peers
RUN npm ci --legacy-peer-deps

# Asegurar que los binarios locales (.bin) estén en PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copiar tsconfig para que tsc tenga configuración
COPY tsconfig.json ./
# Copiar el resto del código fuente
COPY src ./src

# Compilar TypeScript (genera /dist usando el script build)
RUN npm run build

# ===== Stage 2: runtime con Node 18 =====
FROM node:18-alpine AS runtime

WORKDIR /app

# Copiar solo manifiesto para deps de producción
COPY package.json package-lock.json ./

# Instalar solo production deps
RUN npm ci --omit=dev --legacy-peer-deps

# Copiar el JS compilado desde builder
COPY --from=builder /app/dist ./dist

# Exponer puerto de la aplicación
EXPOSE 3001

# Usar node puro para arranque
CMD ["node", "dist/index.js"]
