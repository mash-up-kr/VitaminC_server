import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { GroupMap } from '../entities/map.entity';

export class UpdateMapDto implements Partial<GroupMap> {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;
}
