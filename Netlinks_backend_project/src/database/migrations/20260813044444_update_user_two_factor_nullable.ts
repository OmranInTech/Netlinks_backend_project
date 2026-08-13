import { Migration } from '@mikro-orm/migrations';

export class Migration20260813120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      alter table "user_two_factor"
      alter column "enabled" drop not null;
    `);

    this.addSql(`
      alter table "user_two_factor"
      alter column "secret" drop not null;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      alter table "user_two_factor"
      alter column "enabled" set not null;
    `);

    this.addSql(`
      alter table "user_two_factor"
      alter column "secret" set not null;
    `);
  }
}