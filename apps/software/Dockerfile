# Base avec pnpm
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Étape 2 : Install des dépendances
FROM base AS deps
COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps/software/package.json ./apps/software/package.json
COPY packages ./packages
RUN pnpm install --prod --frozen-lockfile

# Build de l’app React
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=software

# Image finale - serveur statique
FROM node:22-alpine AS release
WORKDIR /app

# Configurer pnpm global sans setup
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN mkdir -p ${PNPM_HOME}
RUN pnpm add -g http-server

# Copier les fichiers de build
COPY --from=build /app/apps/software/dist ./dist

EXPOSE 8080

CMD ["http-server", "dist", "-p", "8080"]
