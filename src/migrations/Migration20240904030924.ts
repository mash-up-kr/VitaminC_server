import { Migration } from '@mikro-orm/migrations';

export class Migration20240904030924 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "map" add column "description" varchar(255) null, add column "is_public" boolean not null default false;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "map" drop column "description", drop column "is_public";',
    );
  }
}
