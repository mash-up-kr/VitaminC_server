import { Migration } from '@mikro-orm/migrations';

export class Migration20240625055046 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "kakao_access_token" varchar(255) not null, add column "kakao_refresh_token" varchar(255) not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user" drop column "kakao_access_token", drop column "kakao_refresh_token";',
    );
  }
}
