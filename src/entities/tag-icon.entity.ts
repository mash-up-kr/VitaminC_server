import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { TagIconRepository } from './tag-icon.repository';

@Entity({
  tableName: 'tag_icon',
  repository: () => TagIconRepository,
})
export class TagIcon {
  @PrimaryKey()
  name: string;

  @Property({ type: 'string', nullable: true })
  iconType?: string;

  [EntityRepositoryType]: TagIconRepository;
}
