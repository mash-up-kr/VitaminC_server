import { ApiProperty } from '@nestjs/swagger';

import { InviteLink } from 'src/entities/index';
import { MapResponseDto } from 'src/map/dtos/map-response.dto';

export class CheckInviteLinkResponseDto {
  @ApiProperty()
  map: MapResponseDto;

  @ApiProperty()
  inviteLink: InviteLink;

  @ApiProperty()
  placePreviewList: string[];
}
