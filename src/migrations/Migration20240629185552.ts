import { Migration } from '@mikro-orm/migrations';

export class Migration20240629185552 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "place" ("id" serial primary key, "kakao_place_id" int not null, "x" int not null, "y" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);',
    );
    this.addSql('comment on table "place" is \'장소 정보\';');
    this.addSql('comment on column "place"."x" is \'경도\';');
    this.addSql('comment on column "place"."y" is \'위도\';');
    this.addSql(
      'alter table "place" add constraint "place_kakao_place_id_unique" unique ("kakao_place_id");',
    );

    this.addSql(
      'create table "place_for_map" ("map_id" varchar(255) not null, "place_id" int not null, "comments" jsonb not null, "liked_user_ids" jsonb not null, "created_by_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "place_for_map_pkey" primary key ("map_id", "place_id"));',
    );
    this.addSql(
      'comment on table "place_for_map" is \'GroupMap에 속한 Place\';',
    );
    this.addSql(
      'comment on column "place_for_map"."comments" is \'사진 URL과 코멘트를 담은 객체 배열\';',
    );
    this.addSql(
      'comment on column "place_for_map"."liked_user_ids" is \'좋아요 누른 유저 ID 배열\';',
    );
    this.addSql(
      'alter table "place_for_map" add constraint "place_for_map_created_by_id_unique" unique ("created_by_id");',
    );

    this.addSql(
      'alter table "place" add constraint "place_kakao_place_id_foreign" foreign key ("kakao_place_id") references "kakao_place" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "place_for_map" add constraint "place_for_map_map_id_foreign" foreign key ("map_id") references "map" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "place_for_map" add constraint "place_for_map_place_id_foreign" foreign key ("place_id") references "place" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "place_for_map" add constraint "place_for_map_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "kakao_place" add column "x" int not null default 0, add column "y" int not null default 0;',
    );
    this.addSql('comment on column "kakao_place"."x" is \'카카오맵 경도\';');
    this.addSql('comment on column "kakao_place"."y" is \'카카오맵 위도\';');
    this.addSql(
      'comment on table "kakao_place" is \'카카오맵에서 제공하는 장소\';',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "place_for_map" drop constraint "place_for_map_place_id_foreign";',
    );

    this.addSql('drop table if exists "place" cascade;');

    this.addSql('drop table if exists "place_for_map" cascade;');

    this.addSql('alter table "kakao_place" drop column "x", drop column "y";');

    this.addSql('comment on table "kakao_place" is \'\';');
  }
}
