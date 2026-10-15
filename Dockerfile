# 1. Installer les dépendances et construire l'application
FROM node:18-alpine AS base

WORKDIR /app

# Copier les fichiers de manifeste
COPY package.json ./
COPY package-lock.json ./

# Installer les dépendances
RUN npm install --production=false

# Copier le reste du code de l'application
COPY . .

# Construire l'application Next.js
RUN npm run build

# 2. Préparer l'image de production
FROM node:18-alpine AS runner

WORKDIR /app

# Copier les dépendances de production depuis l'étape de base
COPY --from=base /app/node_modules ./node_modules
# Copier les fichiers de sortie 'standalone'
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

# Exposer le port sur lequel l'application s'exécutera
EXPOSE 8080

# Définir l'utilisateur pour l'exécution
USER nextjs

# Démarrer l'application
CMD ["node", "server.js"]
