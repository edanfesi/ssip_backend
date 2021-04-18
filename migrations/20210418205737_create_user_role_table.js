exports.up = knex =>
    knex.schema.createTable('user_role', (table) => {
        table.increments('id').primary();
        table.integer('role_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.timestamps(true, true);

        table.foreign('role_id').references('id').inTable('role').onDelete('CASCADE');
        table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');

        table.unique(['role_id', 'user_id']);
    });

exports.down = knex => knex.schema.dropTable('user_role');