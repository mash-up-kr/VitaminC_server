import { Migration } from '@mikro-orm/migrations';

export class Migration20240629180004 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "kakao_place" ("id" serial primary key, "name" varchar(255) not null, "category" varchar(255) not null, "address" varchar(255) not null, "menu_list" jsonb not null, "photo_list" jsonb not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);',
    );
    this.addSql(
      'comment on column "kakao_place"."id" is \'카카오맵에서 제공하는 장소의 ID (basicInfo.cid)\';',
    );
    this.addSql(
      'comment on column "kakao_place"."name" is \'카카오맵 basicInfo.placenamefull\';',
    );
    this.addSql(
      'comment on column "kakao_place"."category" is \'카카오맵 basicInfo.category.cate1name\';',
    );
    this.addSql(
      'comment on column "kakao_place"."address" is \'카카오맵 basicInfo.address.newaddr.newaddrfull\';',
    );
    this.addSql(
      'comment on column "kakao_place"."menu_list" is \'카카오맵 menuInfo.menuList\';',
    );
    this.addSql(
      'comment on column "kakao_place"."photo_list" is \'카카오맵 basicInfo.photo.photoList\';',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "kakao_place" cascade;');
  }
}
