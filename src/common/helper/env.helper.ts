import { resolve } from 'path';

export const getEnvPath = (dest: string): string => {
  const env: string | undefined = process.env.NODE_ENV;
  const filename: string = env ? `.${env}.env` : '.development.env';
  return resolve(`${dest}/${filename}`);
};
