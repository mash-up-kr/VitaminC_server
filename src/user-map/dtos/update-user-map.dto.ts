import { IsOptional } from 'class-validator';

import { UserMap } from '../entities/user-map.entity';

export class UpdateUserMapDto implements Partial<UserMap> {}
