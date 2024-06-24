import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GroupMap } from './entities/map.entity';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [MikroOrmModule.forFeature([GroupMap])],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
