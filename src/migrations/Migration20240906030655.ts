import { Migration } from '@mikro-orm/migrations';

export class Migration20240906030655 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_liked_place" ("user_id" int not null, "place_for_map_map_id" uuid not null, "place_for_map_place_id" int not null, constraint "user_liked_place_pkey" primary key ("user_id", "place_for_map_map_id", "place_for_map_place_id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_liked_place" cascade;');
  }
}
