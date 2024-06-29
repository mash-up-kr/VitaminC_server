import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
}

export class UpdateUserRequestDto implements Partial<User> {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(6, { message: '닉네임은 최대 6글자까지 입력할 수 있어요.' })
  nickname: string;
}
