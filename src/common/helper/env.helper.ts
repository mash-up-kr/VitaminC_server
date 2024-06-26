import { resolve } from 'path';

import { nodeEnvironment } from './env.validation';

export const getEnvPath = (dest: string): string => {
  const env: string = process.env.NODE_ENV;

  if (env == nodeEnvironment.staging || env == nodeEnvironment.production) {
    return undefined;
  }

  const filename: string = env ? `.${env}.env` : '.development.env';
  return resolve(`${dest}/${filename}`);
};
