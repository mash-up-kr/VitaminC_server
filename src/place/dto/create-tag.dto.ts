import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { Tag } from 'src/entities';

export class RegisterPlaceDto {
  @ApiProperty({ type: String, isArray: true })
  @IsNotEmpty()
  tagNames: Tag['name'][];
}
