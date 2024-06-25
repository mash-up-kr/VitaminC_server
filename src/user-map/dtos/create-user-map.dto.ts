import { IsNotEmpty } from 'class-validator';

import { UserMap } from '../entities/user-map.entity';

export class CreateUserMapDto implements Partial<UserMap> {}
