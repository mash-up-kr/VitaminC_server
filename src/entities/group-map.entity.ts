import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { UserMap } from 'src/entities';

@Entity({ tableName: 'map' })
export class GroupMap {
  @PrimaryKey()
  id: string;

  @Property({ type: 'string' })
  name: string;

  @OneToMany({ entity: () => UserMap, mappedBy: (userMap) => userMap.map })
  userMap = new Collection<UserMap>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
