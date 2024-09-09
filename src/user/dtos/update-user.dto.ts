import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, MaxLength } from 'class-validator';

import { User, UserRoleValueType } from 'src/entities';

export class UpdateUserDto implements Partial<User> {
  @IsOptional()
  nickname?: string;

  @IsOptional()
  role?: UserRoleValueType;

  @IsOptional()
  kakaoAccessToken?: string;

  @IsOptional()
  kakaoRefreshToken?: string;

  @IsOptional()
  profileImage?: string;
}

export class UpdateUserRequestDto implements Partial<User> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(6, { message: '닉네임은 최대 6글자까지 입력할 수 있어요.' })
  nickname: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
