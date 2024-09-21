import { Migration } from '@mikro-orm/migrations';

export class Migration20240905025127 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "place_for_map" drop constraint "place_for_map_created_by_id_foreign";',
    );

    this.addSql(
      'alter table "place_for_map" alter column "created_by_id" type int using ("created_by_id"::int);',
    );
    this.addSql(
      'alter table "place_for_map" alter column "created_by_id" drop not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "place_for_map" drop constraint "place_for_map_created_by_id_foreign";',
    );

    this.addSql(
      'alter table "place_for_map" alter column "created_by_id" type int using ("created_by_id"::int);',
    );
    this.addSql(
      'alter table "place_for_map" alter column "created_by_id" set not null;',
    );
  }
}
