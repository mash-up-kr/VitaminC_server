import { ApiProperty } from '@nestjs/swagger';

import { UserMapRole, UserMapRoleValueType } from 'src/entities';

export class UserMapResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: UserMapRole })
  role: UserMapRoleValueType;
}
