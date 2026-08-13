import { Migration } from '@mikro-orm/migrations';

export class Migration20260813160000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      alter table "users" rename to "user";
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      alter table "user" rename to "users";
    `);
  }
}