import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { LoggerMiddleware } from 'src/core/intercepters/logging.interceptor';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getNodeEnv, isIgnoreEnvFile } from './common/helper/env.helper';
import { envValidation } from './common/helper/env.validation';
import { GptModule } from './gpt/gpt.module';
import { MapModule } from './map/map.module';
import { PlaceModule } from './place/place.module';
import { SearchModule } from './search/search.module';
import { UserMapModule } from './user-map/user-map.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/../.${getNodeEnv}.env`,
      cache: true,
      validate: envValidation,
      ignoreEnvFile: isIgnoreEnvFile,
    }),
    MikroOrmModule.forRoot(),
    AuthModule,
    UserModule,
    MapModule,
    UserMapModule,
    GptModule,
    SearchModule,
    UtilModule,
    PlaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('/*');
  }
}
