import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { GroupMap, UserMapRoleValueType } from 'src/entities';

export class UpdateMapDto implements Partial<GroupMap> {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;
}

export class UpdateUserRoleInMapDto {
  @ApiProperty({ enum: ['READ', 'WRITE'] })
  role: UserMapRoleValueType;

  @ApiProperty()
  userId: number;
}
