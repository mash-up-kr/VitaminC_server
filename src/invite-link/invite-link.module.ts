import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GroupMap, InviteLink } from 'src/entities/index';
import { InviteLinkService } from 'src/invite-link/invite-link.service';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [MikroOrmModule.forFeature([InviteLink, GroupMap]), UtilModule],
  providers: [InviteLinkService],
  exports: [InviteLinkService],
})
export class InviteLinkModule {}
