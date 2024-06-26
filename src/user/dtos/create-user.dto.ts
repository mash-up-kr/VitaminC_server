import { IsNotEmpty, IsOptional } from 'class-validator';

import { User } from '../entities/user.entity';
import { UserProviderValueType } from '../entities/user.type';

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
