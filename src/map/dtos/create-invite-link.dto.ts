import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { UserMapRole, UserMapRoleValueType } from 'src/entities/index';

export class CreateInviteLinkDto {
  @IsEnum([UserMapRole.WRITE, UserMapRole.READ])
  @ApiProperty({
    enum: [UserMapRole.WRITE, UserMapRole.READ], // Admin 초대 불가
    default: UserMapRole.READ,
    nullable: true,
  })
  mapRole: UserMapRoleValueType = UserMapRole.READ;
}
