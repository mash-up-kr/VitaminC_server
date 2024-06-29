import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { GroupMap } from 'src/entities';

export class UpdateMapDto implements Partial<GroupMap> {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;
}
