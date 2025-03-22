# Base
FROM node:latest AS base
WORKDIR /usr/src/app

# Installation de pnpm globalement
FROM base AS pnpm-install
RUN npm install -g pnpm

# Installation des dépendances
FROM pnpm-install AS install
RUN mkdir -p /temp/dev
COPY package.json pnpm-lock.yaml turbo.json /temp/dev/
COPY apps/software/package.json /temp/dev/apps/software/package.json
COPY packages/ /temp/dev/packages/
RUN cd /temp/dev && pnpm install

# Installation des dépendances de production
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml turbo.json /temp/prod/
COPY apps/software/package.json /temp/prod/apps/software/package.json
COPY packages/ /temp/prod/packages/
RUN cd /temp/prod && pnpm install --prod --frozen-lockfile

# Préparation du build
FROM pnpm-install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Exécution des tests et du build
ENV NODE_ENV=production
RUN pnpm turbo build --filter=software

# Image finale
FROM nginx:1-alpine-slim AS release
COPY --from=prerelease /usr/src/app/apps/software/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]