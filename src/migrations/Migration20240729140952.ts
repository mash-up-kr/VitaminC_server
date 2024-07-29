import { Migration } from '@mikro-orm/migrations';

export class Migration20240729140952 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "kakao_place" add column "category_icon_code" varchar(255) null;',
    );
    this.addSql(
      'comment on column "kakao_place"."category_icon_code" is \'카카오맵 basicInfo.category.cate1name을 기준으로 매핑한 icon_code\';',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "kakao_place" drop column "category_icon_code";');
  }
}
