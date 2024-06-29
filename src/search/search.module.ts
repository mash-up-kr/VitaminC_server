import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { KakaoPlace } from '../entities';
import { KakaoMapHelper } from './kakao-map.helper';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [HttpModule, MikroOrmModule.forFeature([KakaoPlace])],
  controllers: [SearchController],
  providers: [SearchService, KakaoMapHelper],
  exports: [SearchService],
})
export class SearchModule {}
