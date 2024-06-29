import { ApiProperty } from '@nestjs/swagger';

import { GroupMap, UserMapRole, UserMapRoleValueType } from 'src/entities';

export class MapUser {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: String, nullable: true })
  nickname: string | null = null;

  @ApiProperty({
    enum: [UserMapRole.ADMIN, UserMapRole.READ, UserMapRole.WRITE],
  })
  role: UserMapRoleValueType;
}

export class MapResponseDto implements Partial<GroupMap> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: MapUser, isArray: true })
  users: MapUser[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
