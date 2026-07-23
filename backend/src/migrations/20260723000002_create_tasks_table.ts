import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title', 200).notNullable();
    table.text('description').nullable();
    table.enum('priority', ['Low', 'Medium', 'High']).notNullable();
    table
      .enum('status', ['Pending', 'In Progress', 'Completed'])
      .notNullable()
      .defaultTo('Pending');
    table.date('due_date').notNullable();
    table.timestamps(true, true);

    table.index(['user_id']);
    table.index(['status']);
    table.index(['priority']);
    table.index(['title']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tasks');
}
