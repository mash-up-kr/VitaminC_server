import { Migration } from '@mikro-orm/migrations';

export class Migration20240629143458 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user_map" alter column "role" drop default;');
    this.addSql(
      'alter table "user_map" alter column "role" type text using ("role"::text);',
    );
    this.addSql(
      'alter table "user_map" add constraint "user_map_role_check" check("role" in (\'ADMIN\', \'READ\', \'WRITE\'));',
    );

    this.addSql('drop type "user-map-role";');
  }

  async down(): Promise<void> {
    this.addSql(
      "create type \"user-map-role\" as enum ('ADMIN', 'READ', 'WRITE');",
    );
    this.addSql(
      'alter table "user_map" drop constraint if exists "user_map_role_check";',
    );

    this.addSql(
      'alter table "user_map" alter column "role" type "user-map-role"[] using ("role"::"user-map-role"[]);',
    );
    this.addSql(
      'alter table "user_map" alter column "role" set default \'{READ,WRITE}\';',
    );

    this.addSql(
      'alter table "user_map" alter column "role" set default \'{READ,WRITE}\';',
    );
  }
}
