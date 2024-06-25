import { IsNotEmpty } from 'class-validator';

import { GroupMap } from '../entities/map.entity';

export class CreateMapDto implements Partial<GroupMap> {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;
}
