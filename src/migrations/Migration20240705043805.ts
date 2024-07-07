import { Migration } from '@mikro-orm/migrations';

export class Migration20240705043805 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "map" alter column "id" drop default;');

    this.addSql(
      'alter table "user_map" drop constraint "user_map_map_id_foreign"; alter table "place_for_map" drop constraint "place_for_map_map_id_foreign"; alter table "map" alter column "id" type uuid using ("id"::text::uuid);',
    );
    this.addSql(
      'alter table "map" add constraint "map_name_unique" unique ("name");',
    );

    this.addSql(
      'alter table "user" add column "recent_search_keywords" jsonb not null default \'[]\';',
    );
    this.addSql(
      'comment on column "user"."recent_search_keywords" is \'최근 검색어 배열\';',
    );

    this.addSql(
      'alter table "place_for_map" drop constraint "place_for_map_created_by_id_unique";',
    );

    this.addSql(
      'alter table "place_for_map" alter column "map_id" drop default;',
    );
    this.addSql(
      'alter table "place_for_map" alter column "map_id" type uuid using ("map_id"::text::uuid);',
    );

    this.addSql('alter table "user_map" alter column "map_id" drop default;');
    this.addSql(
      'alter table "user_map" alter column "map_id" type uuid using ("map_id"::text::uuid);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "map" alter column "id" type text using ("id"::text);',
    );

    this.addSql(
      'alter table "place_for_map" alter column "map_id" type text using ("map_id"::text);',
    );

    this.addSql(
      'alter table "user_map" alter column "map_id" type text using ("map_id"::text);',
    );

    this.addSql('alter table "map" drop constraint "map_name_unique";');

    this.addSql(
      'alter table "map" alter column "id" type varchar(255) using ("id"::varchar(255));',
    );

    this.addSql(
      'alter table "place_for_map" alter column "map_id" type varchar(255) using ("map_id"::varchar(255));',
    );
    this.addSql(
      'alter table "place_for_map" add constraint "place_for_map_created_by_id_unique" unique ("created_by_id");',
    );

    this.addSql('alter table "user" drop column "recent_search_keywords";');

    this.addSql(
      'alter table "user_map" alter column "map_id" type varchar(255) using ("map_id"::varchar(255));',
    );
  }
}
