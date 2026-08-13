import { Migration } from '@mikro-orm/migrations';

export class Migration20260813130000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table "user_session" (
        "id" uuid not null,
        "user_id" int not null,
        "refresh_token_hash" varchar(255) not null,
        "expires_at" timestamptz not null,
        "revoked_at" timestamptz null,
        "ip_address" varchar(45) null,
        "user_agent" text null,
        "created_at" timestamptz not null default current_timestamp,
        primary key ("id"),
        constraint "user_session_refresh_token_hash_unique"
          unique ("refresh_token_hash"),
        constraint "user_session_user_id_foreign"
          foreign key ("user_id")
          references "user" ("id")
          on delete cascade
      );
    `);

    this.addSql(`
      create index "user_session_user_id_index"
      on "user_session" ("user_id");
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      drop table if exists "user_session" cascade;
    `);
  }
}