import { Migration } from '@mikro-orm/migrations';

export class Migration20260813100000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table "user" (
        "id" serial primary key,
        "fullname" varchar(255) not null,
        "phone" varchar(255) not null,
        "created_at" timestamptz not null default current_timestamp,
        "updated_at" timestamptz not null default current_timestamp,

        constraint "user_phone_unique"
          unique ("phone")
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      drop table if exists "user" cascade;
    `);
  }
}