import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  PrimaryKeyProp,
  Rel,
} from '@mikro-orm/core';

import { GroupMap } from 'src/map/entities/map.entity';
import { User } from 'src/user/entities/user.entity';

import { UserMapRepository } from '../user-map.repository';

export const UserMapRole = {
  ADMIN: 'ADMIN',
  READ: 'READ',
  WRITE: 'WRITE',
} as const;

export type UserMapRoleValueType =
  (typeof UserMapRole)[keyof typeof UserMapRole];

@Entity({ repository: () => UserMapRepository })
export class UserMap {
  @ManyToOne(() => User, { primary: true })
  user: Rel<User>;

  @ManyToOne(() => GroupMap, { primary: true })
  map: Rel<GroupMap>;

  @Enum({
    items: () => UserMapRole,
    array: true,
    default: [UserMapRole.READ, UserMapRole.WRITE],
    nativeEnumName: 'user-map-role',
  })
  role: UserMapRoleValueType;

  [PrimaryKeyProp]: ['user', 'map'];

  [EntityRepositoryType]?: UserMapRepository;
}
