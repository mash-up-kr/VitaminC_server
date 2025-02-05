import {
  Entity,
  EntityRepositoryType,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { KakaoPlace } from './kakao-place.entity';
import { PlaceRepository } from './place.repository';

@Entity({
  comment: '장소 정보',
  repository: () => PlaceRepository,
})
export class Place {
  @PrimaryKey({
    type: 'integer',
    autoincrement: true,
  })
  id: number;

  @OneToOne({ entity: () => KakaoPlace })
  kakaoPlace: KakaoPlace;

  @Property({
    type: 'double precision',
    comment: '경도',
    default: 0,
  })
  x: number;

  @Property({
    type: 'double precision',
    comment: '위도',
    default: 0,
  })
  y: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [EntityRepositoryType]: PlaceRepository;
}
