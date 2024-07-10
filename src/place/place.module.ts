import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GroupMap, KakaoPlace, Place, PlaceForMap, Tag } from '../entities';
import { SearchModule } from '../search/search.module';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  imports: [
    SearchModule,
    MikroOrmModule.forFeature([Place, KakaoPlace, PlaceForMap, GroupMap, Tag]),
  ],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
