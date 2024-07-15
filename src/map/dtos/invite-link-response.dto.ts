import { ApiProperty } from '@nestjs/swagger';

import {
  InviteLink,
  UserMapRole,
  UserMapRoleValueType,
} from 'src/entities/index';

export class InviteLinkResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({
    enum: [UserMapRole.ADMIN, UserMapRole.READ, UserMapRole.WRITE],
  })
  mapRole: UserMapRoleValueType;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  constructor(inviteLink: InviteLink) {
    this.token = inviteLink.token;
    this.createdAt = inviteLink.createdAt;
    this.mapRole = inviteLink.mapRole;
    this.expiresAt = inviteLink.expiresAt;
  }
}
