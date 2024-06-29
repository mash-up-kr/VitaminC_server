import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { KakaoPlaceRepository } from './kakao-place.repository';

@Entity({
  comment: '카카오맵에서 제공하는 장소',
  repository: () => KakaoPlaceRepository,
})
export class KakaoPlace {
  @PrimaryKey({
    type: 'integer',
    comment: '카카오맵에서 제공하는 장소의 ID (basicInfo.cid)',
  })
  id: number;

  @Property({
    type: 'string',
    comment: '카카오맵 basicInfo.placenamefull',
  })
  name: string;

  @Property({
    type: 'string',
    comment: '카카오맵 basicInfo.category.cate1name',
  })
  category: string;

  @Property({
    type: 'string',
    comment: '카카오맵 basicInfo.address.newaddr.newaddrfull',
  })
  address: string;

  @Property({
    type: 'json',
    comment: '카카오맵 menuInfo.menuList',
  })
  menuList: { menu: string; price: string }[];

  @Property({
    type: 'json',
    comment: '카카오맵 basicInfo.photo.photoList',
  })
  photoList: string[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [EntityRepositoryType]: KakaoPlaceRepository;
}
