import {
  Entity,
  EntityRepositoryType,
  Enum,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

import { UserRepository } from '../user.repository';
import {
  UserProvider,
  UserProviderValueType,
  UserRole,
  UserRoleValueType,
} from './user.type';

const uniqueIndexKeyName = ['provider', 'providerId'];

@Unique({ properties: uniqueIndexKeyName })
@Index({ properties: uniqueIndexKeyName })
@Entity({ repository: () => UserRepository })
export class User {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ type: 'string', default: null })
  nickname: string | null = null;

  @Enum({ items: () => UserProvider, nativeEnumName: 'user_provider' })
  provider: UserProviderValueType;

  @Property()
  providerId: string;

  @Enum({
    items: () => UserRole,
    default: UserRole.USER,
    nativeEnumName: 'user_role',
  })
  role: UserRoleValueType;

  [EntityRepositoryType]?: UserRepository;
}
