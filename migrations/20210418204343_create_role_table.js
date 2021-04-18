exports.up = knex =>
    knex.schema.createTable('role', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamps(true, true);

        table.unique('name');
    });

exports.down = knex => knex.schema.dropTable('role');