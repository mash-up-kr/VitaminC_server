import { Migration } from '@mikro-orm/migrations';

export class Migration20240725031911 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "tag" drop constraint "tag_pkey";');
    this.addSql('alter table "tag" drop column "id";');

    this.addSql('alter table "tag" rename column "content" to "name";');
    this.addSql(
      'alter table "tag" add constraint "tag_pkey" primary key ("name", "map_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "tag" drop constraint "tag_pkey";');

    this.addSql('alter table "tag" add column "id" serial not null;');
    this.addSql('alter table "tag" rename column "name" to "content";');
    this.addSql(
      'alter table "tag" add constraint "tag_pkey" primary key ("id");',
    );
  }
}
