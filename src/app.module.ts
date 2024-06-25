import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getEnvPath } from './common/helper/env.helper';
import { envValidation } from './common/helper/env.validation';
import { MapModule } from './map/map.module';
import { UserMapModule } from './user-map/user-map.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(`${__dirname}/..`),
      cache: true,
      validate: envValidation,
    }),
    MikroOrmModule.forRoot(),
    AuthModule,
    UserModule,
    MapModule,
    UserMapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
