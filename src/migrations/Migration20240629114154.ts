import { Migration } from '@mikro-orm/migrations';

export class Migration20240629114154 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "map" alter column "created_at" drop default;');
    this.addSql(
      'alter table "map" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql('alter table "map" alter column "updated_at" drop default;');
    this.addSql(
      'alter table "map" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql('alter table "user" alter column "created_at" drop default;');
    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql('alter table "user" alter column "updated_at" drop default;');
    this.addSql(
      'alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql(
      'alter table "user_map" alter column "created_at" drop default;',
    );
    this.addSql(
      'alter table "user_map" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "user_map" alter column "updated_at" drop default;',
    );
    this.addSql(
      'alter table "user_map" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "map" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "map" alter column "created_at" set default \'2024-06-29T11:40:54.773Z\';',
    );
    this.addSql(
      'alter table "map" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );
    this.addSql(
      'alter table "map" alter column "updated_at" set default \'2024-06-29T11:40:54.773Z\';',
    );

    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "user" alter column "created_at" set default \'2024-06-29T11:40:54.796Z\';',
    );
    this.addSql(
      'alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );
    this.addSql(
      'alter table "user" alter column "updated_at" set default \'2024-06-29T11:40:54.796Z\';',
    );

    this.addSql(
      'alter table "user_map" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "user_map" alter column "created_at" set default \'2024-06-29T11:40:54.797Z\';',
    );
    this.addSql(
      'alter table "user_map" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );
    this.addSql(
      'alter table "user_map" alter column "updated_at" set default \'2024-06-29T11:40:54.797Z\';',
    );
  }
}
