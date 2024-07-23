import { Migration } from '@mikro-orm/migrations';

export class Migration20240722111556 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tag_icon" ("name" varchar(255) not null, "icon_type" varchar(255) null, constraint "tag_icon_pkey" primary key ("name"));',
    );

    this.addSql('alter table "tag" add column "icon_type" varchar(255) null');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tag_icon" cascade;');

    this.addSql('drop table if exists "tag" cascade;');
  }
}
