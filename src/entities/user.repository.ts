import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';

import { User } from './user.entity';

export class UserRepository extends ExtendedEntityRepository<User> {}
