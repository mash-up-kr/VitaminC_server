import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  PrimaryKeyProp,
  Property,
  Rel,
} from '@mikro-orm/core';

import { GroupMap } from './group-map.entity';
import { UserMapRepository } from './user-map.repository';
import { User } from './user.entity';

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

  @Enum({ items: [UserMapRole.ADMIN, UserMapRole.READ, UserMapRole.WRITE] })
  role: UserMapRoleValueType;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [PrimaryKeyProp]: ['user', 'map'];

  [EntityRepositoryType]?: UserMapRepository;
}
