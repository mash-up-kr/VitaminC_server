import { ApiProperty } from '@nestjs/swagger';

import {
  GroupMap,
  PlaceForMap,
  UserMapRole,
  UserMapRoleValueType,
} from 'src/entities';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';

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

export class MapResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: MapUser, isArray: true })
  users: MapUser[];

  @ApiProperty()
  registeredPlaceCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponseDto })
  createBy: UserResponseDto;

  constructor(map: GroupMap, placeForMap: PlaceForMap[]) {
    this.id = map.id;
    this.name = map.name;
    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;
    this.registeredPlaceCount = placeForMap?.length;
    this.users = map.userMap.getItems().map((userMap) => {
      return {
        id: userMap.user.id,
        role: userMap.role,
        nickname: userMap.user.nickname,
      };
    });
    if (map.createBy) this.createBy = new UserResponseDto(map.createBy);
  }
}
