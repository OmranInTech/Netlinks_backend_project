import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('otp', (table) => {
    table.increments('id').primary();

    table.string('phone').notNullable().index();

    table.string('code').notNullable();

    table.timestamp('expires_at').notNullable();

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.boolean('verified').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('otp');
}