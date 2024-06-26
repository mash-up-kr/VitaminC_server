import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { firstValueFrom } from 'rxjs';

import { User } from 'src/user/entities/user.entity';
import { UserProviderValueType } from 'src/user/entities/user.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private signIn(user: User) {
    const accessToken = this.jwtService.sign({ id: user.id });

    return { user, accessToken };
  }

  async signInThroughOauth({
    provider,
    providerId,
    kakaoAccessToken,
    kakaoRefreshToken,
  }: {
    provider: UserProviderValueType;
    providerId: string;
    kakaoAccessToken: string;
    kakaoRefreshToken: string;
  }) {
    let user: User = await this.userService.findOne({
      provider,
      providerId,
    });

    if (!user) {
      user = await this.userService.create({
        provider,
        providerId,
        kakaoAccessToken,
        kakaoRefreshToken,
      });
    } else {
      user = await this.userService.update(user.id, {
        kakaoAccessToken,
        kakaoRefreshToken,
      });
    }

    return this.signIn(user);
  }

  async signInToKakao(accessToken: string) {
    const requestUrl = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
      Authorization: accessToken,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const params = {
      secure_resource: false,
    };
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ id: string; connected_at: Date }>(requestUrl, {
          headers,
          params,
        }),
      );
      return data.id;
    } catch (e: any) {
      throw new InternalServerErrorException(e.response.data.msg);
    }
  }
}
