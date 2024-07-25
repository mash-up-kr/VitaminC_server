import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
  Rel,
} from '@mikro-orm/core';

import { GroupMap } from 'src/entities/group-map.entity';
import { PlaceForMap } from 'src/entities/place-for-map.entity';
import { TagRepository } from 'src/entities/tag.repository';

@Entity({ tableName: 'tag', repository: () => TagRepository })
export class Tag {
  @PrimaryKey({ type: 'string' })
  name: string;

  @ManyToOne(() => GroupMap, { nullable: true, primary: true })
  map: Rel<GroupMap>;

  @ManyToOne(() => PlaceForMap, { nullable: true })
  placeForMap: Rel<PlaceForMap>;

  @Property({ type: 'string', nullable: true })
  iconType?: string;

  @Property()
  createdAt: Date = new Date();

  [PrimaryKeyProp]: ['name', 'map'];
}
