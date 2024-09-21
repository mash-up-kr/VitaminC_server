import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import {
  GroupMap,
  PlaceForMap,
  Tag,
  TagIcon,
  User,
  UserMap,
} from 'src/entities';
import { MapService } from 'src/map/map.service';
import { UploadModule } from 'src/upload/upload.module';
import { UtilModule } from 'src/util/util.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      User,
      UserMap,
      GroupMap,
      PlaceForMap,
      Tag,
      TagIcon,
    ]),
    UtilModule,
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService, MapService],
  exports: [UserService],
})
export class UserModule {}
``;
