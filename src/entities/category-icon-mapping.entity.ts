import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { CategoryIconMappingRepository } from 'src/entities/category-icon-mapping.repository';

@Entity({ repository: () => CategoryIconMappingRepository })
export class CategoryIconMapping {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property()
  kakaoCategory: string;

  @Property()
  categoryGroup: string;

  @Property()
  iconCode: number;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  [EntityRepositoryType]: CategoryIconMappingRepository;
}
