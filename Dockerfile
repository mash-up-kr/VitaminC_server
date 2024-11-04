FROM node:20-alpine AS builder

WORKDIR /app
RUN npm i -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install
RUN pnpm add express

COPY . .
COPY .production.env ./


RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.production.env ./.production.env

ENV NODE_ENV=production
USER node

CMD ["node", "dist/main.js"]