import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GptUsage } from 'src/entities/gpt-usage.entity';
import { SearchModule } from 'src/search/search.module';

import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  imports: [SearchModule, MikroOrmModule.forFeature([GptUsage])],
  controllers: [GptController],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
