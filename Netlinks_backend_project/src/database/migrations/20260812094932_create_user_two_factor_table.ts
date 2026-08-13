import { Migration } from '@mikro-orm/migrations';

export class Migration20260813140000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table "user_two_factor" (
        "id" uuid not null default gen_random_uuid(),
        "user_id" int not null,
        "enabled" timestamptz not null,
        "secret" varchar(255) not null,
        "created_at" timestamptz not null default current_timestamp,
        "updated_at" timestamptz not null default current_timestamp,

        primary key ("id"),

        constraint "user_two_factor_user_id_unique"
          unique ("user_id"),

        constraint "user_two_factor_user_id_foreign"
          foreign key ("user_id")
          references "user" ("id")
          on delete cascade
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      drop table if exists "user_two_factor" cascade;
    `);
  }
}