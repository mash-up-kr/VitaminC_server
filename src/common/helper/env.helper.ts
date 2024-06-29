import { InternalServerErrorException } from '@nestjs/common';

import { NODE_ENVIRONMENT } from './env.validation';

export const getNodeEnv = (() => {
  const env = process.env.NODE_ENV;
  const nodeEnv = NODE_ENVIRONMENT[env];
  if (nodeEnv === undefined) {
    throw new InternalServerErrorException('Unknown NODE_ENV');
  }
  return nodeEnv;
})();

export const isIgnoreEnvFile =
  getNodeEnv === NODE_ENVIRONMENT.stage ||
  getNodeEnv === NODE_ENVIRONMENT.production;
