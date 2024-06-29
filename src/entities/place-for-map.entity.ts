import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToOne,
  PrimaryKeyProp,
  Property,
  Rel,
} from '@mikro-orm/core';

import { GroupMap } from './group-map.entity';
import { PlaceForMapRepository } from './place-for-map.repository';
import { Place } from './place.entity';
import { User } from './user.entity';

@Entity({
  comment: 'GroupMap에 속한 Place',
  repository: () => PlaceForMapRepository,
})
export class PlaceForMap {
  @ManyToOne(() => GroupMap, { primary: true })
  map: Rel<GroupMap>;

  @ManyToOne(() => Place, { primary: true })
  place: Rel<Place>;

  // 나중에 정규화 하고싶으면 PlaceForMapPhoto라는 Entity를 만들어서 관리하면 될듯.
  @Property({
    type: 'json',
    comment: '사진 URL과 코멘트를 담은 객체 배열',
  })
  comments: { photoUrls: string[]; comment: string; userId: number }[];

  // 나중에 정규화 하고싶으면 PlaceForMapLike라는 Entity를 만들어서 관리하면 될듯.
  @Property({
    type: 'json',
    comment: '좋아요 누른 유저 ID 배열',
  })
  likedUserIds: number[];

  @OneToOne(() => User)
  createdBy: User;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [PrimaryKeyProp]: ['map', 'place'];

  [EntityRepositoryType]: PlaceForMapRepository;
}
