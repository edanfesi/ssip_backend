exports.up = knex =>
    knex.schema.createTable('user', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('last_name').notNullable();
        table.string('country').notNullable();
        table.string('department').notNullable();
        table.string('position').notNullable();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.boolean('is_logged').notNullable().defaultTo(false);
        table.string('login_token');
        table.timestamps(true, true); 
    });

exports.down = knex => knex.schema.dropTable('user');