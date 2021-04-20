exports.up = knex =>
    knex.schema.createTable('user', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('last_name').notNullable();
        table.string('country').notNullable();
        table.string('department').notNullable();
        table.string('work_position').notNullable();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.integer('role_id').unsigned().notNullable().defaultTo(2);;
        table.timestamps(true, true); 

        table.foreign('role_id').references('id').inTable('role').onDelete('CASCADE');
    
        table.unique('username');
    });

exports.down = knex => knex.schema.dropTable('user');