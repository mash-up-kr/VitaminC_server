import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import {
  MenuItem,
  OffDay,
  OpenTime,
} from 'src/place/dto/place-for-map-response.dto';

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
    comment:
      '카카오맵 basicInfo.category.cate1name을 기준으로 매핑한 icon_code',
    nullable: true,
  })
  categoryIconCode: number;

  @Property({
    type: 'string',
    comment: '카카오맵 basicInfo.address.newaddr.newaddrfull',
  })
  address: string;

  @Property({
    type: 'double precision',
    comment: '카카오맵 경도',

    default: 0,
  })
  x: number;

  @Property({
    type: 'double precision',
    comment: '카카오맵 위도',
    default: 0,
  })
  y: number;

  @Property({
    type: 'json',
    comment: '카카오맵 menuInfo.menuList',
  })
  menuList: MenuItem[];

  @Property({
    type: 'string',
    comment: '카카오맵 ',
    default: '',
  })
  mainPhotoUrl: string;

  @Property({
    type: 'json',
    comment: '카카오맵 basicInfo.photo.photoList',
  })
  photoList: string[];

  @Property({
    type: 'decimal',
    comment: '후기 점수',
    scale: 1,
    default: 0,
  })
  score: number;

  @Property({
    type: 'number',
    comment: '리뷰 수',
    default: 0,
  })
  commentCnt: number;

  @Property({
    type: 'number',
    comment: '블로그 리뷰 수',
    default: 0,
  })
  blogReviewCnt: number;

  @Property({
    type: 'json',
    comment: '영업 시간 정보',
    default: '[]',
  })
  openTimeList: OpenTime[];

  @Property({
    type: 'json',
    comment: '휴무일 정보',
    default: '[]',
  })
  offDayList: OffDay[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [EntityRepositoryType]: KakaoPlaceRepository;
}
