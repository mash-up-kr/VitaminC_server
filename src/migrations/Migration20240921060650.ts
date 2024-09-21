import { Migration } from '@mikro-orm/migrations';

export class Migration20240921060650 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "place_for_map" drop column "liked_user_ids";');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "place_for_map" add column "liked_user_ids" jsonb not null;',
    );
    this.addSql(
      'comment on column "place_for_map"."liked_user_ids" is \'좋아요 누른 유저 ID 배열\';',
    );
  }
}
