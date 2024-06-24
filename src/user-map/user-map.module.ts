import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserMap } from './entities/user-map.entity';
import { UserMapService } from './user-map.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserMap])],
  providers: [UserMapService],
  exports: [UserMapService],
})
export class UserMapModule {}
