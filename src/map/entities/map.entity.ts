import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { UserMap } from 'src/user-map/entities/user-map.entity';

import { MapRepository } from '../map.repository';

@Entity({ repository: () => MapRepository, tableName: 'map' })
export class GroupMap {
  @PrimaryKey()
  id: string;

  @Property({ type: 'string' })
  name: string;

  @OneToMany({ entity: () => UserMap, mappedBy: (userMap) => userMap.map })
  userMap = new Collection<UserMap>(this);

  [EntityRepositoryType]?: MapRepository;
}
