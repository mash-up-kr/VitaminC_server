import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { User } from '../entities/user.entity';
import {
  UserProviderValueType,
  UserRoleValueType,
} from '../entities/user.type';

export class UpdateUserDto implements Partial<User> {
  @ApiProperty({ required: false })
  @IsOptional()
  nickname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  provider?: UserProviderValueType;

  @ApiProperty({ required: false })
  @IsOptional()
  providerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  role?: UserRoleValueType;

  @IsOptional()
  kakaoAccessToken?: string;

  @IsOptional()
  kakaoRefreshToken?: string;
}
