import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

import { PlaceForMap } from './place-for-map.entity';
import { UserMap } from './user-map.entity';
import { UserRepository } from './user.repository';

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
@Entity({ repository: () => UserRepository })
export class User {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ type: 'string', default: null })
  nickname: string | null = null;

  @Property({ type: 'string', default: null, length: 1024 })
  profileImage: string | null = null;

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

  @Property({
    type: 'json',
    comment: '최근 검색어 배열',
    default: '[]',
  })
  recentSearchKeywords: string[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToMany(() => PlaceForMap, (p: PlaceForMap) => p.likedUser, {
    owner: true,
    nullable: true,
  })
  likedPlace = new Collection<PlaceForMap>(this);

  [EntityRepositoryType]?: UserRepository;
}
