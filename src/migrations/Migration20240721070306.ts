import { Migration } from '@mikro-orm/migrations';

export class Migration20240721070306 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "map" alter column "create_by_id" type int using ("create_by_id"::int);',
    );
    this.addSql('alter table "map" alter column "create_by_id" set not null;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "map" alter column "create_by_id" type int using ("create_by_id"::int);',
    );
    this.addSql('alter table "map" alter column "create_by_id" drop not null;');
  }
}
