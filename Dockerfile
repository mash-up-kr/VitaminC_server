FROM node:18-alpine

RUN npm install -g npm@9.8.1
RUN npm i -g pnpm
WORKDIR /app

COPY ./package.json /app
COPY ./pnpm-lock.yaml /app
RUN pnpm i --frozen-lockfile

#TODO: add db migrate command

COPY . /app
RUN pnpm run build