import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  async signInThroughOauth(provider: string): Promise<User> {
    let user = await this.usersService.findOne({
      provider: { equals: provider },
    });

    if (!user) {
      user = await this.usersService.create({ provider });
    }
    return user;
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
