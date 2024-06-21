import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Migrator } from '@mikro-orm/migrations';
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const configService = new ConfigService();
const logger = new Logger('MikroORM');

const MikroOrmConfig: Options = {
  logger: logger.log.bind(logger),
  highlighter: new SqlHighlighter(),
  driver: PostgreSqlDriver,
  clientUrl: configService.get('DATABASE_URL'),
  extensions: [Migrator],
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.{ts,js}'],
};
export default MikroOrmConfig;
