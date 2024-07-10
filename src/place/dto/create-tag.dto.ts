import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class RegisterPlaceDto {
  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  tagIds: number[];
}
