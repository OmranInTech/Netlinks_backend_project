import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_two_factor', (table) => {
    table
      .timestamp('enabled')
      .nullable()
      .alter();

    table
      .string('secret', 255)
      .nullable()
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_two_factor', (table) => {
    table
      .timestamp('enabled')
      .notNullable()
      .alter();

    table
      .string('secret', 255)
      .notNullable()
      .alter();
  });
}