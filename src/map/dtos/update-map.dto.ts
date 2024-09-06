import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { GroupMap, UserMapRole, UserMapRoleValueType } from 'src/entities';

export class UpdateMapDto implements Partial<GroupMap> {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateUserRoleInMapDto {
  @ApiProperty({ enum: [UserMapRole.READ, UserMapRole.WRITE] })
  role: UserMapRoleValueType;

  @ApiProperty()
  userId: number;
}
