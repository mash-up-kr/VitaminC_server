import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { InviteLinkModule } from 'src/invite-link/invite-link.module';

import { GroupMap, PlaceForMap, UserMap } from '../entities';
import { UserModule } from '../user/user.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { IsMapNameUnique } from './validator/is-map-name-unique.validator';

@Module({
  imports: [
    MikroOrmModule.forFeature([GroupMap, UserMap, PlaceForMap]),
    UserModule,
    InviteLinkModule,
  ],
  controllers: [MapController],
  providers: [MapService, IsMapNameUnique],
  exports: [MapService],
})
export class MapModule {}
