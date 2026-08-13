import { Migration } from '@mikro-orm/migrations';

export class Migration20260813111215 extends Migration {

  override name = 'Migration20260813111215';

  override up(): void | Promise<void> {
    this.addSql(`create table "otp" ("id" serial primary key, "phone" varchar(255) not null, "code" varchar(255) not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "verified" boolean not null default false);`);
    this.addSql(`create index "otp_phone_index" on "otp" ("phone");`);

    this.addSql(`create table "user" ("id" serial primary key, "fullname" varchar(100) not null, "phone" varchar(20) not null, "deleted_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "user_session" ("id" uuid not null, "user_id" int not null, "refresh_token_hash" varchar(255) not null, "expires_at" timestamptz not null, "revoked_at" timestamptz null, "ip_address" varchar(45) null, "user_agent" text null, "created_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`create table "user_two_factor" ("id" uuid not null default gen_random_uuid(), "user_id" int not null, "enabled" timestamptz null, "secret" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "user_two_factor" add constraint "user_two_factor_user_id_unique" unique ("user_id");`);
    this.addSql(`alter table "user_two_factor" add constraint "user_two_factor_user_id_unique" unique ("user_id");`);


    this.addSql(`alter table "user_two_factor" add constraint "user_two_factor_user_id_foreign" foreign key ("user_id") references "user" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user_session" drop constraint "user_session_user_id_foreign";`);
    this.addSql(`alter table "user_two_factor" drop constraint "user_two_factor_user_id_foreign";`);

    this.addSql(`drop table if exists "otp" cascade;`);
    this.addSql(`drop table if exists "user" cascade;`);
    this.addSql(`drop table if exists "user_session" cascade;`);
    this.addSql(`drop table if exists "user_two_factor" cascade;`);
  }

}
