# Étape 1 : Base
FROM node:18 AS base
WORKDIR /usr/src/app

# Étape 2 : Installation de pnpm globalement
FROM base AS pnpm-install
RUN npm install -g pnpm

# Étape 3 : Installation des dépendances
FROM pnpm-install AS install
RUN mkdir -p /temp/dev
COPY package.json pnpm-lock.yaml turbo.json /temp/dev/
COPY apps/web/package.json /temp/dev/apps/web/package.json
COPY packages/ /temp/dev/packages/
RUN cd /temp/dev && pnpm install

# Installation des dépendances de production
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml turbo.json /temp/prod/
COPY apps/web/package.json /temp/prod/apps/web/package.json
COPY packages/ /temp/prod/packages/
RUN cd /temp/prod && pnpm install --prod --frozen-lockfile

# Étape 4 : Build de l'application
FROM pnpm-install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm turbo build --filter=web && ls -la /usr/src/app/apps/web/.next

# Étape 5 : Démarrage de l'application Next.js
FROM base AS release
RUN npm install -g pnpm
# Copier pnpm depuis l'étape pnpm-install
COPY --from=pnpm-install /usr/local/bin/pnpm /usr/local/bin/pnpm
# Copier les fichiers nécessaires
COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/apps/web ./apps/web
COPY --from=prerelease /usr/src/app/package.json ./
COPY --from=prerelease /usr/src/app/pnpm-lock.yaml ./
COPY --from=prerelease /usr/src/app/turbo.json ./

# Exposer le port 3000 (port par défaut de Next.js)
EXPOSE 3000

# Démarrer l'application Next.js
CMD ["pnpm", "start"]