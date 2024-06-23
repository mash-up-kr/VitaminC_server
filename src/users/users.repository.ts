import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';

import { User } from './entities/user.entity';

export class UsersRepository extends ExtendedEntityRepository<User> {}
