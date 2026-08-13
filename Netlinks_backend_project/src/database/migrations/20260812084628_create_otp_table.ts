import { Migration } from '@mikro-orm/migrations';

export class Migration20260813170000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table "otp" (
        "id" serial primary key,
        "phone" varchar(255) not null,
        "code" varchar(255) not null,
        "expires_at" timestamptz not null,
        "created_at" timestamptz not null default current_timestamp,
        "verified" boolean not null default false
      );
    `);

    this.addSql(`
      create index "otp_phone_index"
      on "otp" ("phone");
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      drop table if exists "otp" cascade;
    `);
  }
}