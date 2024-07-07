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
}

export function toUserResponseDto(user: User): UserResponseDto {
  const userResponse = new UserResponseDto();
  userResponse.id = user.id;
  userResponse.nickname = user.nickname;
  userResponse.provider = user.provider;
  userResponse.providerId = user.providerId;
  userResponse.role = user.role;

  return userResponse;
}
