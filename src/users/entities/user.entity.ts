import { Enum, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

import {
  UserProvider,
  UserProviderValueType,
  UserRole,
  UserRoleValueType,
} from './user.type';

const uniqueIndexKeyName = ['provider', 'providerId'];

@Unique({ properties: uniqueIndexKeyName })
@Index({ properties: uniqueIndexKeyName })
export class User {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ type: 'string', default: null })
  nickname: string | null = null;

  @Enum(() => UserProvider)
  provider: UserProviderValueType;

  @Property()
  providerId: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRoleValueType;
}
