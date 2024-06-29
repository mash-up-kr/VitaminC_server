declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    NODE_ENV: string;
    JWT_PRIVATE_KEY: string;
    JWT_PUBLIC_KEY: string;
    DB_HOST: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    KAKAO_CLIENT_ID: string;
    KAKAO_REDIRECT_URL: string;
    KAKAO_REST_API_KEY: string;
    CLIENT_URL: string;
    GPT_KEY: string;

    DISCORD_WEBHOOK_URL: string;

    // for test
    TEST_USER_ID?: number;
  }
}
