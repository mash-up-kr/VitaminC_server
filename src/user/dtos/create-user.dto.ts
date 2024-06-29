import { IsNotEmpty, IsOptional } from 'class-validator';

import { User, UserProviderValueType } from 'src/entities';

export class CreateUserDto implements Partial<User> {
  @IsOptional()
  nickname?: string;

  @IsNotEmpty()
  provider: UserProviderValueType;

  @IsNotEmpty()
  providerId: string;

  @IsNotEmpty()
  kakaoAccessToken: string;

  @IsNotEmpty()
  kakaoRefreshToken: string;
}
