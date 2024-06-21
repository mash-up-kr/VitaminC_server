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
DATABASE_URL=postgresql://postgres:1q2w3e4r@localhost:5432/postgres?schema=public
```

### 2.1. Create local postgres (optional)

```bash
$ docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=1q2w3e4r -d postgres
```

### 3. Migrate database (optional)

```bash
$ pnpm migrate:up:dev
```

### 4. Start

```bash
$ pnpm start:dev
```

## Todo
