import { ApiProperty } from '@nestjs/swagger';

import {
  UserMapRepository,
  UserMapRole,
  UserMapRoleValueType,
} from '../../entities';

export class MapItemForUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: [UserMapRole.ADMIN, UserMapRole.READ, UserMapRole.WRITE],
  })
  role: UserMapRoleValueType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
