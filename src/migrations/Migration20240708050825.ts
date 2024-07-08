import { Migration } from '@mikro-orm/migrations';

export class Migration20240708050825 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "invite_link" alter column "map_id" drop default;',
    );
    this.addSql(
      'alter table "invite_link" alter column "map_id" type uuid using ("map_id"::text::uuid);',
    );
    this.addSql(
      'alter table "invite_link" add constraint "invite_link_map_id_foreign" foreign key ("map_id") references "map" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "invite_link" alter column "map_id" type text using ("map_id"::text);',
    );

    this.addSql(
      'alter table "invite_link" drop constraint "invite_link_map_id_foreign";',
    );

    this.addSql(
      'alter table "invite_link" alter column "map_id" type varchar(255) using ("map_id"::varchar(255));',
    );
  }
}
