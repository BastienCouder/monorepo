# Base
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# Installation des dépendances
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock turbo.json /temp/dev/
COPY apps/web/package.json /temp/dev/apps/web/package.json
COPY packages/ /temp/dev/packages/
RUN cd /temp/dev && bun install

# Installation des dépendances de production
RUN mkdir -p /temp/prod
COPY package.json bun.lock turbo.json /temp/prod/
COPY apps/web/package.json /temp/prod/apps/web/package.json
COPY packages/ /temp/prod/packages/
RUN cd /temp/prod && bun init && bun install --production --frozen-lockfile

# Préparation du build
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Exécution des tests et du build
ENV NODE_ENV=production
RUN bunx turbo build --filter=web

# Image finale
FROM nginx:1-alpine-slim AS release
COPY --from=prerelease /usr/src/app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

# // Commandes
# # Créer l'image Docker
# docker build -t bastiencdr/web:latest -f apps/web/Dockerfile .
# # Lancer le conteneur Docker
# docker run -p 8080:80 bastiencdr/web:latest