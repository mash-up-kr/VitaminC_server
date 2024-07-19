import { Migration } from '@mikro-orm/migrations';

export class Migration20240718130151 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "kakao_place" add column "main_photo_url" varchar(255) not null default \'\', add column "score" numeric(10,1) not null default 0, add column "comment_cnt" int not null default 0, add column "blog_review_cnt" int not null default 0, add column "open_time_list" jsonb not null default \'[]\', add column "off_day_list" jsonb not null default \'[]\';',
    );
    this.addSql(
      'alter table "kakao_place" alter column "x" type double precision using ("x"::double precision);',
    );
    this.addSql(
      'alter table "kakao_place" alter column "y" type double precision using ("y"::double precision);',
    );
    this.addSql(
      'comment on column "kakao_place"."main_photo_url" is \'카카오맵 \';',
    );
    this.addSql('comment on column "kakao_place"."score" is \'후기 점수\';');
    this.addSql(
      'comment on column "kakao_place"."comment_cnt" is \'리뷰 수\';',
    );
    this.addSql(
      'comment on column "kakao_place"."blog_review_cnt" is \'블로그 리뷰 수\';',
    );
    this.addSql(
      'comment on column "kakao_place"."open_time_list" is \'영업 시간 정보\';',
    );
    this.addSql(
      'comment on column "kakao_place"."off_day_list" is \'휴무일 정보\';',
    );

    this.addSql(
      'alter table "place" alter column "x" type double precision using ("x"::double precision);',
    );
    this.addSql('alter table "place" alter column "x" set default 0;');
    this.addSql(
      'alter table "place" alter column "y" type double precision using ("y"::double precision);',
    );
    this.addSql('alter table "place" alter column "y" set default 0;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "invite_link" alter column "map_id" type text using ("map_id"::text);',
    );

    this.addSql(
      'alter table "invite_link" drop constraint "invite_link_map_id_foreign";',
    );

    this.addSql(
      'alter table "kakao_place" drop column "main_photo_url", drop column "score", drop column "comment_cnt", drop column "blog_review_cnt", drop column "open_time_list", drop column "off_day_list";',
    );

    this.addSql(
      'alter table "kakao_place" alter column "x" type int using ("x"::int);',
    );
    this.addSql(
      'alter table "kakao_place" alter column "y" type int using ("y"::int);',
    );

    this.addSql('alter table "place" alter column "x" drop default;');
    this.addSql(
      'alter table "place" alter column "x" type int using ("x"::int);',
    );
    this.addSql('alter table "place" alter column "y" drop default;');
    this.addSql(
      'alter table "place" alter column "y" type int using ("y"::int);',
    );

    this.addSql(
      'alter table "invite_link" alter column "map_id" type varchar(255) using ("map_id"::varchar(255));',
    );
  }
}
