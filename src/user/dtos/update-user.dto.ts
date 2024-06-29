import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { User, UserProviderValueType, UserRoleValueType } from 'src/entities';

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
