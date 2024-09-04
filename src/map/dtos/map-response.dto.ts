import { ApiProperty } from '@nestjs/swagger';

import {
  GroupMap,
  PlaceForMap,
  User,
  UserMap,
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

  @ApiProperty({ type: MapUser, isArray: true, nullable: true })
  users: MapUser[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  registeredPlaceCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponseDto })
  createBy: UserResponseDto;

  constructor(map: GroupMap, placeForMap: PlaceForMap[] = null) {
    this.id = map.id;
    this.name = map.name;
    this.description = map.description;
    this.isPublic = map.isPublic;
    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;
    this.registeredPlaceCount = placeForMap?.length;

    if (map.userMap?.isInitialized()) {
      this.users = map.userMap.getItems().map((userMap: UserMap) => {
        return {
          id: userMap.user.id,
          role: userMap.role,
          nickname: userMap.user.nickname,
        };
      });
    }

    if (map.createBy) this.createBy = new UserResponseDto(map.createBy);
  }

  public sortMembers(currentUser: User = null) {
    this.users.sort((a: MapUser, b: MapUser): number => {
      // 본인을 최우선으로
      if (currentUser) {
        const isCurrentUserA = a.id === currentUser.id;
        const isCurrentUserB = b.id === currentUser.id;

        if (isCurrentUserA && !isCurrentUserB) return -1;
        if (!isCurrentUserA && isCurrentUserB) return 1;
      }

      // 모임장을 다음으로
      const isAdminA = a.role === UserMapRole.ADMIN;
      const isAdminB = b.role === UserMapRole.ADMIN;

      if (isAdminA && !isAdminB) return -1;
      if (!isAdminA && isAdminB) return 1;

      // 나머지 멤버는 그대로
      return 0;
    });
  }
}

export class PublicMapResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  placeCount: number;

  @ApiProperty()
  userCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  description: string;

  constructor(map: any) {
    this.id = map.id;
    this.name = map.name;
    this.placeCount = map.placeCount;
    this.userCount = map.userCount;
    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;
    this.isPublic = map.isPublic;
    this.description = map.description;
  }
}
