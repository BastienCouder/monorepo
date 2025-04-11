# Image de base avec pnpm via Corepack
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

# Activer Corepack pour pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Installation des dépendances
FROM base AS deps
COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages ./packages
RUN pnpm install --prod --frozen-lockfile

# Build de l'app
FROM deps AS build
COPY . .
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=web

# Image finale allégée pour exécution
FROM base AS final
WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# Copier uniquement ce qui est nécessaire pour exécution
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/web/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]