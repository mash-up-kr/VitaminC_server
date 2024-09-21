import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MapModule } from 'src/map/map.module';

import {
  GroupMap,
  KakaoPlace,
  Place,
  PlaceForMap,
  Tag,
  TagIcon,
  UserMap,
} from '../entities';
import { SearchModule } from '../search/search.module';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  imports: [
    SearchModule,
    MikroOrmModule.forFeature([
      Place,
      KakaoPlace,
      PlaceForMap,
      GroupMap,
      Tag,
      TagIcon,
      UserMap,
    ]),
    MapModule,
  ],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
