FROM node:22-alpine

WORKDIR /app
COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile --filter email...

CMD ["pnpm", "--filter", "email", "dev"]
