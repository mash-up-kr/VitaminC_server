import { Migration } from '@mikro-orm/migrations';

export class Migration20240721062235 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "map" add column "create_by_id" int null;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "map" drop constraint "map_create_by_id_foreign";',
    );

    this.addSql('alter table "tag" drop constraint "tag_map_id_foreign";');
    this.addSql(
      'alter table "tag" drop constraint "tag_place_for_map_map_id_place_for_map_place_id_foreign";',
    );

    this.addSql('alter table "map" drop column "create_by_id";');
  }
}
