import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import { GptUsage } from 'src/entities/gpt-usage.entity';

export class GptUsageRepository extends ExtendedEntityRepository<GptUsage> {}
