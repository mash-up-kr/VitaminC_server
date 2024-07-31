import { Migration } from '@mikro-orm/migrations';

export class Migration20240729152526 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "kakao_place" alter column "category_icon_code" type int using ("category_icon_code"::int);',
    );
    this.addSql(
      'comment on column "kakao_place"."category" is \'카카오맵 basicInfo.category.catename\';',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "kakao_place" alter column "category_icon_code" type varchar(255) using ("category_icon_code"::varchar(255));',
    );
    this.addSql(
      'comment on column "kakao_place"."category" is \'카카오맵 basicInfo.category.cate1name\';',
    );
  }
}
