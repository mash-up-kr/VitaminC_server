import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UtilModule } from 'src/util/util.module';

import { KakaoMapHelper } from './kakao-map.helper';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [HttpModule, UtilModule],
  controllers: [SearchController],
  providers: [SearchService, KakaoMapHelper],
})
export class SearchModule {}
