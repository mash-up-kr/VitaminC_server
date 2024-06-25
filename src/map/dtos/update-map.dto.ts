import { IsOptional } from 'class-validator';

import { GroupMap } from '../entities/map.entity';

export class UpdateMapDto implements Partial<GroupMap> {
  @IsOptional()
  id?: string;

  @IsOptional()
  name?: string;
}
