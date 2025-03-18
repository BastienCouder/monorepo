# Étape 1 : Base
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Étape 2 : Installation des dépendances
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
COPY bun.lock /temp/prod/bun.lock 
RUN cd /temp/prod && bun install

# Étape 3 : Préparation du build
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Exécution des tests et du build
ENV NODE_ENV=production
RUN bunx turbo build --filter=web

# Étape 4 : Image finale
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/apps/web/dist ./dist
COPY --from=prerelease /usr/src/app/apps/web/public ./public
COPY --from=prerelease /usr/src/app/apps/web/package.json .

# Exécution de l'application
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]