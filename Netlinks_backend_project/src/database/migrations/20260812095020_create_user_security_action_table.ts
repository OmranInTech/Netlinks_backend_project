import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_security_action', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .integer('user_id')
      .nullable()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');

    table.timestamp('used').notNullable();

    table.timestamp('expires_at').notNullable();

    table.string('secret', 255).notNullable();

    table.string('event_type', 50).notNullable();

    table.string('ip_address', 45).nullable();

    table.text('user_agent').nullable();

    table.text('metadata').nullable();

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.index(['user_id']);
    table.index(['event_type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_security_action');
}