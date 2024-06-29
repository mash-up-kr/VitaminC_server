import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GroupMap, UserMap } from 'src/entities';

import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [MikroOrmModule.forFeature([GroupMap, UserMap])],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
