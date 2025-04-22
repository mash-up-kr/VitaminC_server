import { Migration } from '@mikro-orm/migrations';

export class Migration20250205045753 extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS postgis;');

    this.addSql('alter table "place" add column "location" geometry null;');

    this.addSql(
      'CREATE INDEX place_location_gist ON "place" USING GIST("location");',
    );
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS place_location_gist;');
    this.addSql('alter table "place" drop column "location";');
    this.addSql('DROP EXTENSION IF EXISTS postgis;');
  }
}
