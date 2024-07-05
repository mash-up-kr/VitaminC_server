import { ApiProperty } from '@nestjs/swagger';

export class InviteLinkResponseDto {
  @ApiProperty()
  inviteLinkToken: string;
}
