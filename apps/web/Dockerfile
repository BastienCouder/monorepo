# Étape 1 : Build de l'application
FROM node:18 as builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# Installer les dépendances
RUN yarn install

# Copier le code source
COPY . .

# Construire l'application
RUN yarn build

# Étape 2 : Environnement de production
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# Installer uniquement les dépendances de production
RUN yarn install --production

# Copier les fichiers construits depuis l'étape builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["yarn", "start"]