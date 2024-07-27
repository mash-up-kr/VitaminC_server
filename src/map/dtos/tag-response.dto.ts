import { ApiProperty } from '@nestjs/swagger';

import { Tag } from 'src/entities';

export class TagResponseDto implements Partial<Tag> {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: String, nullable: true })
  iconType?: string | null;

  constructor(tag: Partial<Tag>) {
    this.name = tag.name;
    this.iconType = tag.iconType ?? null;
  }
}
