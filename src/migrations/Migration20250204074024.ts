import { Migration } from '@mikro-orm/migrations';

export class Migration20250204074024 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" alter column "profile_image" type varchar(1024) using ("profile_image"::varchar(1024));',
    );

    this.addSql(
      'alter table "gpt_usage" alter column "max_limit" type int using ("max_limit"::int);',
    );
    this.addSql(
      'alter table "gpt_usage" alter column "max_limit" set default 10;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user" alter column "profile_image" type varchar(255) using ("profile_image"::varchar(255));',
    );

    this.addSql(
      'alter table "gpt_usage" alter column "max_limit" type int using ("max_limit"::int);',
    );
    this.addSql(
      'alter table "gpt_usage" alter column "max_limit" set default 3;',
    );
  }
}
