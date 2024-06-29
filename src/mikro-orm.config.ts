import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Migrator } from '@mikro-orm/migrations';
import {
  Options,
  PostgreSqlDriver,
  ReflectMetadataProvider,
} from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { entities } from 'src/entities';

import { UtilService } from './util/util.service';

const configService = new ConfigService();
const utilService = new UtilService(configService);
const logger = new Logger('MikroORM');

const MikroOrmConfig: Options = {
  logger: logger.log.bind(logger),
  highlighter: new SqlHighlighter(),
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  host: configService.get('DB_HOST'),
  user: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  port: configService.get('DB_PORT') ?? 5432,
  dbName: configService.get('DB_NAME'),
  entities: entities,
  metadataProvider: ReflectMetadataProvider,
  debug: utilService.isDev(),
};

export default MikroOrmConfig;
