import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { GroupMap } from 'src/entities';

export class CreateMapDto implements Partial<GroupMap> {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
