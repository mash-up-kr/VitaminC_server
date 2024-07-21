import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional } from 'class-validator';

import {
  User,
  UserProvider,
  UserProviderValueType,
  UserRole,
  UserRoleValueType,
} from 'src/entities';

export class UserResponseDto implements Partial<Omit<User, 'userMap'>> {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  nickname?: string;

  @ApiProperty({ enum: UserProvider })
  @IsNotEmpty()
  provider: UserProviderValueType;

  @ApiProperty()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ enum: UserRole })
  @IsNotEmpty()
  role: UserRoleValueType;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.provider = user.provider;
    this.providerId = user.providerId;
    this.role = user.role;
  }
}
