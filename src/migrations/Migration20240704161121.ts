import { Migration } from '@mikro-orm/migrations';

export class Migration20240704161121 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "invite_link" add column "map_role" varchar(255) not null default \'WRITE\';',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "invite_link" drop column "map_role";');
  }
}
