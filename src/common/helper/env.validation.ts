import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer K)[] ? K : never;

const envArray = ['development', 'stage', 'production', 'test'] as const;

export type EnvType = ArrayElement<typeof envArray>;

export const NODE_ENVIRONMENT = envArray.reduce(
  (acc, cur) => {
    acc[cur] = cur;
    return acc;
  },
  {} as Record<EnvType, EnvType>,
);

export class EnvironmentVariables {
  @IsEnum(NODE_ENVIRONMENT)
  NODE_ENV: keyof typeof NODE_ENVIRONMENT;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  JWT_PRIVATE_KEY: string;

  @IsString()
  JWT_PUBLIC_KEY: string;

  @IsString()
  KAKAO_CLIENT_ID: string;

  @IsString()
  KAKAO_REDIRECT_URL: string;

  @IsString()
  KAKAO_REST_API_KEY: string;

  @IsNumber()
  @IsOptional()
  TEST_USER_ID?: number;

  @IsString()
  CLIENT_URL: string;

  @IsString()
  DISCORD_WEBHOOK_URL: string;
  
  @IsString()
  GPT_KEY: string;
}

export function envValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
