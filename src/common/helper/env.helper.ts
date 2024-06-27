import { resolve } from 'path';

import { NODE_ENVIRONMENT } from './env.validation';

export const getEnvPath = (dest: string): string => {
  const env: string = process.env.NODE_ENV;

  if (env == nodeEnvironment.staging || env == nodeEnvironment.production) {
    return undefined;
  }

  const filename: string = env ? `.${env}.env` : '.development.env';
  return resolve(`${dest}/${filename}`);
};

export const ignoreEnvFile = ((): boolean => {
  const env = process.env.NODE_ENV;
  return env === NODE_ENVIRONMENT.stage || env === NODE_ENVIRONMENT.production;
})();
