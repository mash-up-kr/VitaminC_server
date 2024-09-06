import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { GroupMapRepository, User, UserMap } from 'src/entities';

@Entity({ tableName: 'map', repository: () => GroupMapRepository })
export class GroupMap {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property({ type: 'string', unique: true })
  name: string;

  @Property({ type: 'string', nullable: true })
  description?: string;

  @Property({ type: 'boolean', default: false })
  isPublic: boolean;

  @OneToMany({ entity: () => UserMap, mappedBy: (userMap) => userMap.map })
  userMap = new Collection<UserMap>(this);

  @ManyToOne(() => User)
  createBy: User;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [EntityRepositoryType]: GroupMapRepository;
}
