import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UtilModule } from 'src/util/util.module';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { KakaoPlace } from '../entities';
import { KakaoMapHelper } from './kakao-map.helper';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [HttpModule, UtilModule,MikroOrmModule.forFeature([KakaoPlace])],
  controllers: [SearchController],
  providers: [SearchService, KakaoMapHelper],
  exports: [SearchService],
})
export class SearchModule {}
