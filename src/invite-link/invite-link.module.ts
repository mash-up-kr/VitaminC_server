import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { InviteLink } from 'src/entities/index';
import { InviteLinkService } from 'src/invite-link/invite-link.service';
import { UserMapModule } from 'src/user-map/user-map.module';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [MikroOrmModule.forFeature([InviteLink]), UserMapModule, UtilModule],
  providers: [InviteLinkService],
  exports: [InviteLinkService],
})
export class InviteLinkModule {}
