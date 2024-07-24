import { ApiProperty } from '@nestjs/swagger';

import { Tag } from 'src/entities';

export class TagResponseDto implements Partial<Tag> {
  // @ApiProperty()
  // id: number;

  // @ApiProperty({ type: String, nullable: true })
  // mapId: string | null;

  @ApiProperty()
  content: string;

  // @ApiProperty()
  // createdAt: Date;

  @ApiProperty({ type: String, nullable: true })
  iconType?: string | null;

  constructor(tag: Partial<Tag>) {
    // this.id = tag.id;
    // this.mapId = tag.map ? tag.map.id : null;
    this.content = tag.content;
    // this.createdAt = tag.createdAt;
    this.iconType = tag.iconType ?? null;
  }
}
