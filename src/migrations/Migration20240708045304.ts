import { Migration } from '@mikro-orm/migrations';

export class Migration20240708045304 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "place_category" ("name" varchar(255) not null, "image_url" varchar(255) null, constraint "place_category_pkey" primary key ("name"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "place_category" cascade;');
  }
}
