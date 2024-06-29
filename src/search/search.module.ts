import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { KakaoMapHelper } from './kakao-map.helper';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [HttpModule],
  controllers: [SearchController],
  providers: [SearchService, KakaoMapHelper],
})
export class SearchModule {}
