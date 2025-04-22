import { Migration } from '@mikro-orm/migrations';

export class Migration20250206083958 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "place" alter column "location" type geometry(Point, 4326) using ("location"::geometry(Point, 4326));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "place" alter column "location" type geometry using ("location"::geometry);',
    );
  }
}
