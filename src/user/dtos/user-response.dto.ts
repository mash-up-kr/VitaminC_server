import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional } from 'class-validator';

import { User } from '../entities/user.entity';
import {
  UserProvider,
  UserProviderValueType,
  UserRole,
  UserRoleValueType,
} from '../entities/user.type';
import { UserMapResponseDto } from './user-map-response.dto';

// TODO: userMap 할거 맞나?
export class UserResponseDto implements Partial<Omit<User, 'userMap'>> {
  static fromEntity(user: User): UserResponseDto {
    const userMap = user.userMap.getItems().map((userMap) => ({
      id: userMap.map.id,
      name: userMap.map.name,
      role: userMap.role,
    }));

    return {
      id: user.id,
      nickname: user.nickname,
      provider: user.provider,
      providerId: user.providerId,
      role: user.role,
      userMap,
    };
  }

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

  @ApiProperty({ type: [UserMapResponseDto] })
  userMap: UserMapResponseDto[];
}
