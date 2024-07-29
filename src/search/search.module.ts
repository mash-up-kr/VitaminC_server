import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserModule } from 'src/user/user.module';
import { UtilModule } from 'src/util/util.module';

import { CategoryIconMapping, KakaoPlace, PlaceForMap } from '../entities';
import { KakaoMapHelper } from './kakao-map.helper';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    HttpModule,
    UtilModule,
    MikroOrmModule.forFeature([KakaoPlace, PlaceForMap, CategoryIconMapping]),
    UserModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, KakaoMapHelper],
  exports: [SearchService],
})
export class SearchModule {}
