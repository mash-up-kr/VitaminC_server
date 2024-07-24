import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { PlaceCategoryRepository } from './place-category.repository';

@Entity({
  tableName: 'place_category',
  repository: () => PlaceCategoryRepository,
})
export class PlaceCategory {
  @PrimaryKey()
  name: string;

  @Property({ type: 'string', nullable: true })
  imageUrl?: string;

  [EntityRepositoryType]: PlaceCategoryRepository;
}
