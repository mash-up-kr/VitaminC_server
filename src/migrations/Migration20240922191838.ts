import { Migration } from '@mikro-orm/migrations';

export class Migration20240922191838 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "gpt_usage" ("id" serial primary key, "user_id" int not null, "usage_year" int not null, "usage_month" int not null, "usage_day" int not null, "usage_count" int not null default 1, "max_limit" int not null default 3);',
    );
    this.addSql(
      'alter table "gpt_usage" add constraint "gpt_usage_user_id_usage_year_usage_month_usage_day_unique" unique ("user_id", "usage_year", "usage_month", "usage_day");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "gpt_usage" cascade;');
  }
}
