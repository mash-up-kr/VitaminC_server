import { Migration } from '@mikro-orm/migrations';

export class Migration20240621085648 extends Migration {
  async up(): Promise<void> {
    this.addSql('create type "user_provider" as enum (\'KAKAO\');');
    this.addSql("create type \"user_role\" as enum ('USER', 'ADMIN');");
    this.addSql(
      'create table "user" ("id" serial primary key, "nickname" varchar(255) null, "provider" "user_provider" not null, "provider_id" varchar(255) not null, "role" "user_role" not null default \'USER\');',
    );
    this.addSql(
      'create index "user_provider_provider_id_index" on "user" ("provider", "provider_id");',
    );
    this.addSql(
      'alter table "user" add constraint "user_provider_provider_id_unique" unique ("provider", "provider_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop type "user_provider";');
    this.addSql('drop type "user_role";');
  }
}
