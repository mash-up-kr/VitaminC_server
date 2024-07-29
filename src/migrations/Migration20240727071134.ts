import { Migration } from '@mikro-orm/migrations';

export class Migration20240727071134 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "category_icon_mapping" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "category_icon_mapping" alter column "created_at" set default CURRENT_TIMESTAMP;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "category_icon_mapping" alter column "created_at" drop default;',
    );
    this.addSql(
      'alter table "category_icon_mapping" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
  }
}
