import { Migration } from '@mikro-orm/migrations';

export class Migration20240727070747 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "category_icon_mapping" ("id" serial primary key, "kakao_category" varchar(255) not null, "category_group" varchar(255) not null, "icon_code" int not null, "created_at" timestamptz not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "category_icon_mapping" cascade;');
  }
}
