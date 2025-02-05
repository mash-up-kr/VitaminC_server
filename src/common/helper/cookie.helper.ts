import { CookieOptions } from 'express';

import { getNodeEnv } from 'src/common/helper/env.helper';
import { NODE_ENVIRONMENT } from 'src/common/helper/env.validation';

export const getCookieOption = (): CookieOptions => {
  if (getNodeEnv === NODE_ENVIRONMENT.development) {
    return {
      path: '/',
      maxAge: 1_000_000_000,
    };
  }
  return {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1 * 365),
    domain: '.korrk.kr',
  };
};
