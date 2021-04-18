exports.up = knex =>
    knex.schema.createTable('role_permission', (table) => {
        table.increments('id').primary();
        table.integer('role_id').unsigned().notNullable();
        table.string('actions');
        table.timestamps(true, true);

        table.foreign('role_id').references('id').inTable('role').onDelete('CASCADE');
    
        table.unique('role_id');
    });

exports.down = knex => knex.schema.dropTable('role_permission');