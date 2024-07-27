import { Migration } from '@mikro-orm/migrations';

export class Migration20240727053120 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "place_for_map_tags" ("place_for_map_map_id" uuid not null, "place_for_map_place_id" int not null, "tag_name" varchar(255) not null, "tag_map_id" uuid not null, constraint "place_for_map_tags_pkey" primary key ("place_for_map_map_id", "place_for_map_place_id", "tag_name", "tag_map_id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "place_for_map_tags" cascade;');
  }
}
