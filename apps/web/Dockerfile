# Base
FROM node:22-alpine AS base
WORKDIR /app

# Installation de pnpm globalement
FROM base AS pnpm-install
RUN npm install -g pnpm

# Installation des dépendances
FROM pnpm-install AS dependencies
COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile

# Build de l'application
FROM dependencies AS build
COPY . .
ARG HELLO_WORLD
RUN echo "HELLO_WORLD=${HELLO_WORLD}" >> .env
ENV NODE_ENV=production
RUN pnpm turbo --filter=web build

# Image finale
FROM node:22-alpine AS release
WORKDIR /app

# Copier pnpm et ses dépendances depuis l'étape pnpm-install
COPY --from=pnpm-install /usr/local/bin/pnpm /usr/local/bin/pnpm
COPY --from=pnpm-install /usr/local/lib/node_modules/pnpm /usr/local/lib/node_modules/pnpm

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires depuis l'étape build
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/apps/web ./apps/web
COPY --from=build --chown=nextjs:nodejs /app/package.json ./
COPY --from=build --chown=nextjs:nodejs /app/pnpm-lock.yaml ./
COPY --from=build --chown=nextjs:nodejs /app/turbo.json ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

# Définir les permissions pour le cache Next.js
RUN mkdir -p /app/apps/web/.next/cache && \
    chown -R nextjs:nodejs /app/apps/web/.next

# Utiliser l'utilisateur non-root
USER nextjs

# Exposer le port 3000 (port par défaut de Next.js)
EXPOSE 3000

CMD ["node", "apps/web/server.js"]

# Commandes
# Créer l'image Docker
# docker build -t web:latest -f apps/web/Dockerfile .
# Créer l'image Docker avec argument
# docker build -t web:latest --build-arg HELLO_WORLD="Bonjour le monde" -f apps/web/Dockerfile .
# Lancer le conteneur Docker
# docker run -p 3000:3000 web:latest
# Lancer le entrypoint
# docker run -it --entrypoint /bin/sh web:latest