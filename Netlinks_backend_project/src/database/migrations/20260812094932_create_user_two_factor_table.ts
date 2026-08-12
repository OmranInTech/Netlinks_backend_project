import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_two_factor', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .integer('user_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');

    table.timestamp('enabled').notNullable();

    table.string('secret', 255).notNullable();

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_two_factor');
}