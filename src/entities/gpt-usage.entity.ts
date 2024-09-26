import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

import { GPT_USAGE_MAX_LIMIT } from 'src/common/constants';
import { GptUsageRepository } from 'src/entities/gpt-usage.repository';
import { User } from 'src/entities/user.entity';

@Unique({ properties: ['user', 'usageYear', 'usageMonth', 'usageDay'] })
@Entity({ repository: () => GptUsageRepository })
export class GptUsage {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Property()
  usageYear: number;

  @Property()
  usageMonth: number;

  @Property()
  usageDay: number;

  @Property({ default: 1 })
  usageCount!: number;

  @Property({ default: GPT_USAGE_MAX_LIMIT })
  maxLimit!: number;

  [EntityRepositoryType]?: GptUsageRepository;
}
