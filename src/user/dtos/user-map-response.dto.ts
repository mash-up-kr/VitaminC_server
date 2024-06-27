import { ApiProperty } from '@nestjs/swagger';

import {
  UserMapRole,
  UserMapRoleValueType,
} from '../../user-map/entities/user-map.entity';

export class UserMapResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: UserMapRole })
  role: UserMapRoleValueType;
}
