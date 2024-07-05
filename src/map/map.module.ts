import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GroupMap, PlaceForMap, UserMap } from 'src/entities';

import { MapController } from './map.controller';
import { MapService } from './map.service';
import { IsMapNameUnique } from './validator/is-map-name-unique.validator';

@Module({
  imports: [MikroOrmModule.forFeature([GroupMap, UserMap, PlaceForMap])],
  controllers: [MapController],
  providers: [MapService, IsMapNameUnique],
  exports: [MapService],
})
export class MapModule {}
