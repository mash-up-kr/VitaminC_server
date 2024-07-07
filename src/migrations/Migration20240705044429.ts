import { Migration } from '@mikro-orm/migrations';

export class Migration20240705044429 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "place_for_map" add constraint "place_for_map_map_id_foreign" foreign key ("map_id") references "map" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "user_map" add constraint "user_map_map_id_foreign" foreign key ("map_id") references "map" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "place_for_map" drop constraint "place_for_map_map_id_foreign";',
    );

    this.addSql(
      'alter table "user_map" drop constraint "user_map_map_id_foreign";',
    );
  }
}
