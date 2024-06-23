declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: string | undefined;
    JWT_PRIVATE_KEY: string;
    JWT_PUBLIC_KEY: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
  }
}
