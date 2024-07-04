import { Migration } from '@mikro-orm/migrations';

export class Migration20240704075203 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "invite_link" ("token" varchar(255) not null, "created_by_id" int not null, "map_id" varchar(255) not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "invite_link_pkey" primary key ("token"));',
    );

    this.addSql(
      'alter table "invite_link" add constraint "invite_link_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "invite_link" cascade;');
  }
}
