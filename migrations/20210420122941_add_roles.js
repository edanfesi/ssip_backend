exports.up = (knex) => knex('role').insert([
  { id: 1, name: 'admin', permissions: '["create", "delete", "update", "read"]' },
  { id: 2, name: 'user', permissions: '["read"]' },
]);

exports.down = (knex) => knex('role').del();
