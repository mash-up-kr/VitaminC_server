import { ApiProperty } from '@nestjs/swagger';

import { PlaceForMap } from 'src/entities';

export class PlaceForMapResponseDto implements Partial<PlaceForMap> {
  // @ApiProperty({type: })
  // map: ;

  @ApiProperty({ isArray: true })
  comments: [];

  @ApiProperty({ isArray: true })
  likedUserIds: [];

  // @ApiProperty({type: })
  // createdBy: ;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
