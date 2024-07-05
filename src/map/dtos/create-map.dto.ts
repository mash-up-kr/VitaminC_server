import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, Validate } from 'class-validator';

import { GroupMap } from 'src/entities';
import { IsMapNameUnique } from 'src/map/validator/is-map-name-unique.validator';

export class CreateMapDto implements Partial<GroupMap> {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsMapNameUnique)
  name: string;
}
