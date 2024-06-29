import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional } from 'class-validator';

import { User, UserProvider, UserProviderValueType } from 'src/entities';

export class CreateUserDto implements Partial<User> {
  @ApiProperty({ required: false })
  @IsOptional()
  nickname?: string;

  @ApiProperty({ enum: UserProvider })
  @IsNotEmpty()
  provider: UserProviderValueType;

  @ApiProperty()
  @IsNotEmpty()
  providerId: string;

  @IsNotEmpty()
  kakaoAccessToken: string;

  @IsNotEmpty()
  kakaoRefreshToken: string;
}
