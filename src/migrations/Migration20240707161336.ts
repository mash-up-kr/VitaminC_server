import { Migration } from '@mikro-orm/migrations';

export class Migration20240707161336 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tag" ("id" serial primary key, "map_id" uuid null, "place_for_map_map_id" uuid null, "place_for_map_place_id" int null, "content" varchar(255) not null, "created_at" timestamptz not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tag" cascade;');
  }
}
