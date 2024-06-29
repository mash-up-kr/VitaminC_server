import { Migration } from '@mikro-orm/migrations';

export class Migration20240629114055 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "map" add column "created_at" timestamptz not null default \'2024-06-29T11:40:54.773Z\', add column "updated_at" timestamptz not null default \'2024-06-29T11:40:54.773Z\';',
    );

    this.addSql(
      'alter table "user" add column "created_at" timestamptz not null default \'2024-06-29T11:40:54.796Z\', add column "updated_at" timestamptz not null default \'2024-06-29T11:40:54.796Z\';',
    );

    this.addSql(
      'alter table "user_map" add column "created_at" timestamptz not null default \'2024-06-29T11:40:54.797Z\', add column "updated_at" timestamptz not null default \'2024-06-29T11:40:54.797Z\';',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "map" drop column "created_at", drop column "updated_at";',
    );

    this.addSql(
      'alter table "user" drop column "created_at", drop column "updated_at";',
    );

    this.addSql(
      'alter table "user_map" drop column "created_at", drop column "updated_at";',
    );
  }
}
