import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { firstValueFrom } from 'rxjs';

import { $Enums, User } from 'src/prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signIn(user: User) {
    const accessToken = this.jwtService.sign({ id: user.id });

    return { user, accessToken };
  }

  async signInThroughOauth({
    provider,
    providerId,
  }: {
    provider: keyof typeof $Enums.Provider;
    providerId: string;
  }) {
    let user: User = await this.usersService.findOne({
      provider: { equals: provider },
      providerId: { equals: providerId },
    });

    if (!user) {
      user = await this.usersService.create({ provider, providerId });
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
