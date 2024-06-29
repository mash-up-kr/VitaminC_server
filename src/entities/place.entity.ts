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

  // OneToOne
  @OneToOne({ entity: () => KakaoPlace })
  kakaoPlace: KakaoPlace;

  @Property({
    type: 'integer',
    comment: '경도',
  })
  x: number;

  @Property({
    type: 'integer',
    comment: '위도',
  })
  y: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [EntityRepositoryType]: PlaceRepository;
}
