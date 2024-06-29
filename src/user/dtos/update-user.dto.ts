import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { User } from '../entities/user.entity';
import { UserRoleValueType } from '../entities/user.type';

export class UpdateUserDto implements Partial<User> {
  @IsOptional()
  nickname?: string;

  @IsOptional()
  role?: UserRoleValueType;

  @IsOptional()
  kakaoAccessToken?: string;

  @IsOptional()
  kakaoRefreshToken?: string;
}

export class UpdateUserRequestDto implements Partial<User> {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
