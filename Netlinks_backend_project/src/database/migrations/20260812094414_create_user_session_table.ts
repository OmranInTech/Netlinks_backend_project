import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_session', (table) => {
    table.uuid('id').primary();

    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');

    table
      .string('refresh_token_hash', 255)
      .notNullable()
      .unique();

    table.timestamp('expires_at').notNullable();

    table.timestamp('revoked_at').nullable();

    table.string('ip_address', 45).nullable();

    table.text('user_agent').nullable();

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.index(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
 
  await knex.schema.dropTableIfExists('user_session');
}