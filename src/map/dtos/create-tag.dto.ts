import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { Tag } from 'src/entities/tag.entity';

export class CreateTagDto implements Partial<Tag> {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
