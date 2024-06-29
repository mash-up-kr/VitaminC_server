import {
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

import { UserMap } from './user-map.entity';

const uniqueIndexKeyName = ['provider', 'providerId'];

export const UserProvider = {
  KAKAO: 'KAKAO',
} as const;

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type UserProviderValueType =
  (typeof UserProvider)[keyof typeof UserProvider];
export type UserRoleValueType = (typeof UserRole)[keyof typeof UserRole];

@Unique({ properties: uniqueIndexKeyName })
@Index({ properties: uniqueIndexKeyName })
@Entity()
export class User {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ type: 'string', default: null })
  nickname: string | null = null;

  @Property()
  kakaoAccessToken: string;

  @Property()
  kakaoRefreshToken: string;

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

  @OneToMany({ entity: () => UserMap, mappedBy: (userMap) => userMap.user })
  userMap = new Collection<UserMap>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
