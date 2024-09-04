import { Migration } from '@mikro-orm/migrations';

export class Migration20240904080344 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "profile_image" varchar(255) null;',
    );

    this.addSql(
      'alter table "invite_link" alter column "map_role" type varchar(255) using ("map_role"::varchar(255));',
    );
    this.addSql(
      'alter table "invite_link" alter column "map_role" set default \'READ\';',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "profile_image";');

    this.addSql(
      'alter table "invite_link" alter column "map_role" type varchar(255) using ("map_role"::varchar(255));',
    );
    this.addSql(
      'alter table "invite_link" alter column "map_role" set default \'WRITE\';',
    );
  }
}
