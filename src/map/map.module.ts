import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { InviteLinkModule } from 'src/invite-link/invite-link.module';

import { GroupMap, UserMap } from '../entities';
import { UserMapService } from '../user-map/user-map.service';
import { UserModule } from '../user/user.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([GroupMap, UserMap]),
    UserModule,
    InviteLinkModule,
  ],
  controllers: [MapController],
  providers: [MapService, UserMapService],
  exports: [MapService],
})
export class MapModule {}
