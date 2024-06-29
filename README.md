## Before getting started

### 0. Install pnpm

```bash
$ npx pnpm@9.3.0 install
```

### 1. Install deps

```bash
$ pnpm install
```

### 2. Create .development.env

```js
// ./.env
  DB_USER=postgres
  DB_NAME=postgres
  DB_PASSWORD=1q2w3e4r
```

### 2.1. Create local postgres (optional)

```bash
$ docker compose --env-file .development.env up -d
```

### 2.2. Or with migrated local postgres

```bash
$ pnpm postgres:local:up
```

### 3. Migrate database (optional, can skip if you follow step 2.2.)

```bash
$ pnpm migrate:up:dev
```

### 4. Start

```bash
$ pnpm start:dev
```

## Error catch

### [sentry url](https://vitaminc.sentry.io/projects/node-nestjs/?project=4507516570697728)

## Todo
