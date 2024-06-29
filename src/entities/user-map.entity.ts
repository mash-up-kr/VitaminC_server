import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKeyProp,
  Property,
  Rel,
} from '@mikro-orm/core';

import { GroupMap } from './group-map.entity';
import { User } from './user.entity';

export const UserMapRole = {
  ADMIN: 'ADMIN',
  READ: 'READ',
  WRITE: 'WRITE',
} as const;

export type UserMapRoleValueType =
  (typeof UserMapRole)[keyof typeof UserMapRole];

@Entity()
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

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [PrimaryKeyProp]: ['user', 'map'];
}
