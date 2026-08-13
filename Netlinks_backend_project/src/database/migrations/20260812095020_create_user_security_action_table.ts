import { Migration } from '@mikro-orm/migrations';

export class Migration20260813150000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table "user_security_action" (
        "id" uuid not null default gen_random_uuid(),
        "user_id" int null,
        "used" timestamptz not null,
        "expires_at" timestamptz not null,
        "secret" varchar(255) not null,
        "event_type" varchar(50) not null,
        "ip_address" varchar(45) null,
        "user_agent" text null,
        "metadata" text null,
        "created_at" timestamptz not null default current_timestamp,

        primary key ("id"),

        constraint "user_security_action_user_id_foreign"
          foreign key ("user_id")
          references "user" ("id")
          on delete cascade
      );
    `);

    this.addSql(`
      create index "user_security_action_user_id_index"
      on "user_security_action" ("user_id");
    `);

    this.addSql(`
      create index "user_security_action_event_type_index"
      on "user_security_action" ("event_type");
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      drop table if exists "user_security_action" cascade;
    `);
  }
}