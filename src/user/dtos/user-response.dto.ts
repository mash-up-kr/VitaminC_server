import { ApiProperty } from '@nestjs/swagger';

import { User, UserProvider, UserProviderValueType } from 'src/entities';

export class UserResponseDto implements Partial<Omit<User, 'userMap'>> {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  nickname?: string;

  @ApiProperty({ enum: UserProvider })
  provider: UserProviderValueType;

  @ApiProperty()
  providerId: string;

  // @ApiProperty({ enum: UserRole })
  // role: UserRoleValueType;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.provider = user.provider;
    this.providerId = user.providerId;
    // this.role = user.role;
  }
}
