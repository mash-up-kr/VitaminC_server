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

const development = 'development';
const stage = 'stage';
const production = 'production';
const test = 'test';

export const NODE_ENVIRONMENT = {
  [development]: development,
  [stage]: stage,
  [production]: production,
  [test]: test,
} as const;

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
