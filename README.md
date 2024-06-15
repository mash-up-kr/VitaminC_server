## Before getting started

### 1. Install deps

```bash
$ pnpm install
```

### 2. Generate prisma

```bash
$ npx prisma generate
```

### 3. Create .env

```js
// ./.env
DATABASE_URL=postgresql://postgres:1q2w3e4r@localhost:5432/postgres?schema=public
```

### 3.1 Create local postgres (optional)

```bash
$ docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=1q2w3e4r -d postgres
```

### 4. Migrate database (optional)

```bash
npx prisma migrate dev
```

### 5. Start

```bash
$ pnpm start:dev
```

## Prisma extensions

VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=Prisma.prisma

## Todo

1. 주병호
   [ ] 1. prettier(import order)
   [ ] 2. husky
   [ ] 3. config service
