import { ApiProperty } from '@nestjs/swagger';

export class InviteLinkResponseDto {
  @ApiProperty()
  invite_link_token: string;
}
