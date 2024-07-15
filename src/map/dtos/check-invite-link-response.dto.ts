import { ApiProperty } from '@nestjs/swagger';

import { InviteLinkResponseDto } from 'src/map/dtos/invite-link-response.dto';
import { MapResponseDto } from 'src/map/dtos/map-response.dto';

export class CheckInviteLinkResponseDto {
  @ApiProperty({ type: MapResponseDto })
  map: MapResponseDto;

  @ApiProperty({ type: InviteLinkResponseDto })
  inviteLink: InviteLinkResponseDto;

  @ApiProperty()
  placePreviewList: string[];

  constructor(
    map: MapResponseDto,
    inviteLink: InviteLinkResponseDto,
    placePreviewList: string[],
  ) {
    this.map = map;
    this.inviteLink = inviteLink;
    this.placePreviewList = placePreviewList;
  }
}
