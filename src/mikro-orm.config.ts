import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Migrator } from '@mikro-orm/migrations';
import {
  Options,
  PostgreSqlDriver,
  ReflectMetadataProvider,
} from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { IS_DEV } from 'src/common/constants';

const configService = new ConfigService();
const logger = new Logger('MikroORM');

const MikroOrmConfig: Options = {
  logger: logger.log.bind(logger),
  highlighter: new SqlHighlighter(),
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  host: configService.get('DB_HOST'),
  user: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  dbName: configService.get('DB_NAME'),
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.{ts,js}'],
  metadataProvider: ReflectMetadataProvider,
  debug: IS_DEV,
};
export default MikroOrmConfig;
