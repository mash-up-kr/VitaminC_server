declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PORT: string;
    NODE_ENV: string | undefined;
    JWT_PRIVATE_KEY: string;
    JWT_PUBLIC_KEY: string;
  }
}
