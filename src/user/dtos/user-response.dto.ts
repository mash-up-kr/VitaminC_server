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
