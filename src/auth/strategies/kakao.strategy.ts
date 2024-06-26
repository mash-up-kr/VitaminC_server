import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy } from 'passport-kakao';

export interface KakaoPayload {
  id: number;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_REDIRECT_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: KakaoPayload, info?: any) => void,
  ) {
    try {
      const {
        _json: { id },
      }: { _json: { id: number } } = profile;

      return done(null, { id, accessToken, refreshToken });
    } catch (e) {
      done(e);
    }
  }
}
