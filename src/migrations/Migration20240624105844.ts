import { Migration } from '@mikro-orm/migrations';

export class Migration20240624105844 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "map" ("id" varchar(255) not null, "name" varchar(255) not null, constraint "map_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "user_map" ("user_id" int not null, "map_id" varchar(255) not null, "role" text[] not null default \'{READ,WRITE}\', constraint "user_map_pkey" primary key ("user_id", "map_id"));',
    );

    this.addSql(
      'alter table "user_map" add constraint "user_map_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "user_map" add constraint "user_map_map_id_foreign" foreign key ("map_id") references "map" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_map" drop constraint "user_map_map_id_foreign";',
    );

    this.addSql('drop table if exists "map" cascade;');

    this.addSql('drop table if exists "user_map" cascade;');
  }
}
